import { Router, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Validation schemas
const querySchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000),
  sessionId: z.string().optional(),
  context: z.record(z.any()).optional()
});

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // Max requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Check rate limit
const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
};

// GET /api/ai/sessions - Get user's AI sessions
router.get('/sessions', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    
    const sessions = await prisma.aiSession.findMany({
      where: userId ? { userId } : { userId: null },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/ai/sessions/:id - Get specific session with messages
router.get('/sessions/:id', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const session = await prisma.aiSession.findFirst({
      where: {
        id,
        OR: [
          { userId: userId || null },
          { userId: null }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/ai/sessions/:id - Delete a session
router.delete('/sessions/:id', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const session = await prisma.aiSession.findFirst({
      where: {
        id,
        userId: userId || null
      }
    });

    if (!session) {
      throw new AppError('Session not found', 404);
    }

    await prisma.aiSession.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Session deleted'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/ai/query - Send a message to REALITO AI
router.post('/query', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const data = querySchema.parse(req.body);
    
    // Rate limiting
    const identifier = req.user?.id || req.ip || 'anonymous';
    if (!checkRateLimit(identifier)) {
      throw new AppError('Rate limit exceeded. Please try again later.', 429);
    }

    const userId = req.user?.id;
    
    // Get or create session
    let sessionId = data.sessionId;
    let session;
    
    if (sessionId) {
      session = await prisma.aiSession.findFirst({
        where: { id: sessionId }
      });
    }
    
    if (!session) {
      session = await prisma.aiSession.create({
        data: {
          userId: userId || null,
          mode: 'tourist'
        }
      });
      sessionId = session.id;
    }

    // Save user message
    await prisma.aiMessage.create({
      data: {
        sessionId,
        sender: 'user',
        content: data.message
      }
    });

    // Get context data (businesses, places, events) for RAG
    const contextData = await getContextData();
    
    // Generate AI response
    const aiResponse = await generateAIResponse(data.message, contextData, data.context);
    
    // Save AI response
    const aiMessage = await prisma.aiMessage.create({
      data: {
        sessionId,
        sender: 'realito',
        content: aiResponse.message,
        actions: aiResponse.actions
      }
    });

    // Update session
    await prisma.aiSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    });

    // Log the conversation
    await prisma.analyticsEvent.create({
      data: {
        userId: userId || null,
        eventType: 'realito_query',
        metadata: {
          sessionId,
          message: data.message,
          responseLength: aiResponse.message.length
        },
        ipAddress: req.ip || undefined,
        userAgent: req.get('user-agent') || undefined
      }
    });

    res.json({
      success: true,
      data: {
        sessionId,
        message: aiMessage,
        actions: aiResponse.actions
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
});

// Helper function to get context data for AI
async function getContextData() {
  try {
    const [businesses, events, routes, markers] = await Promise.all([
      prisma.business.findMany({
        where: { isActive: true },
        select: { name: true, category: true, description: true },
        take: 10
      }),
      prisma.event.findMany({
        where: { isActive: true, startDate: { gte: new Date() } },
        select: { title: true, description: true, location: true, startDate: true },
        take: 5
      }),
      prisma.route.findMany({
        where: { isActive: true },
        select: { name: true, description: true, difficulty: true, durationMinutes: true },
        take: 5
      }),
      prisma.marker.findMany({
        where: { isActive: true },
        select: { name: true, category: true, description: true },
        take: 10
      })
    ]);

    return { businesses, events, routes, markers };
  } catch (error) {
    console.error('Error fetching context data:', error);
    return { businesses: [], events: [], routes: [], markers: [] };
  }
}

// Helper function to generate AI response
async function generateAIResponse(
  userMessage: string, 
  contextData: any,
  customContext?: Record<string, any>
): Promise<{ message: string; actions?: any[] }> {
  
  // Check if OpenAI is configured
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (openaiApiKey) {
    try {
      // Use OpenAI API
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: openaiApiKey });
      
      const systemPrompt = `Eres REALITO, el asistente virtual turístico de RDM Digital (Real del Monte), un hermoso Pueblo Mágico en Hidalgo, México.
      
Tu rol es ayudar a turistas y visitantes a descubrir los mejores lugares, experiencias, eventos y rutas en Real del Monte y sus alrededores.

Información disponible:
- Negocios: ${JSON.stringify(contextData.businesses)}
- Eventos próximos: ${JSON.stringify(contextData.events)}
- Rutas turísticas: ${JSON.stringify(contextData.routes)}
- Lugares/Markers: ${JSON.stringify(contextData.markers)}

Instrucciones:
1. Responde siempre en español de manera amigable y útil
2. Proporciona información específica basada en los datos disponibles
3. Si no tienes información precisa, sugiere que el usuario visite nuestro directorio o contacte directamente
4. Recomienda lugares, eventos y rutas relevantes según el interés del usuario
5. Incluye información práctica como horarios, ubicaciones y recomendaciones
6. Cuando sea apropiado, sugiere acciones como ver más detalles, ver en el mapa, o navegar a páginas específicas

${customContext ? `Contexto adicional: ${JSON.stringify(customContext)}` : ''}

Responde de manera concisa pero informativa.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return {
        message: completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta en este momento.',
        actions: generateActions(userMessage)
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fall through to fallback
    }
  }
  
  // Fallback response without AI
  return {
    message: generateFallbackResponse(userMessage),
    actions: generateActions(userMessage)
  };
}

// Generate suggested actions based on user message
function generateActions(userMessage: string): any[] {
  const message = userMessage.toLowerCase();
  const actions = [];
  
  if (message.includes('lugar') || message.includes('visitar') || message.includes('que hay')) {
    actions.push({ type: 'navigation', label: 'Ver Lugares', path: '/lugares' });
    actions.push({ type: 'navigation', label: 'Ver Mapa', path: '/mapa' });
  }
  
  if (message.includes('negocio') || message.includes('comer') || message.includes('comprar')) {
    actions.push({ type: 'navigation', label: 'Ver Directorio', path: '/directorio' });
  }
  
  if (message.includes('evento') || message.includes('que pasa')) {
    actions.push({ type: 'navigation', label: 'Ver Eventos', path: '/eventos' });
  }
  
  if (message.includes('ruta') || message.includes('caminar') || message.includes('recorrer')) {
    actions.push({ type: 'navigation', label: 'Ver Rutas', path: '/rutas' });
  }
  
  if (message.includes('historia') || message.includes('cultura')) {
    actions.push({ type: 'navigation', label: 'Ver Historia', path: '/historia' });
    actions.push({ type: 'navigation', label: 'Ver Cultura', path: '/cultura' });
  }
  
  return actions.slice(0, 3);
}

// Generate fallback response when AI is not available
function generateFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('hola') || message.includes('buenos') || message.includes('que tal')) {
    return `¡Hola! 👋 Soy REALITO, tu asistente turístico virtual de Real del Monte. 🏔️
    
Estoy aquí para ayudarte a descubrir los mejores lugares, eventos y experiencias en nuestro hermoso Pueblo Mágico.
    
¿Qué te gustaría saber sobre Real del Monte? Puedo ayudarte con:
- 🏛️ Lugares turísticos y sitios de interés
- 🍽️ Restaurantes, cafés y tiendas
- 🎉 Eventos y actividades
- 🥾 Rutas de senderismo
- 📜 Historia y cultura local`;
  }
  
  if (message.includes('lugar') || message.includes('visitar')) {
    return `¡Qué excelente que quieras visitar Real del Monte! 🌄
    
Algunos de los lugares más populares que puedes visitar incluyen:
- El Panteón Inglés (famoso por sus criptas victorianas)
- La Mina de Acosta (recorre tunnels históricos)
- El Vista del Peñón (vista panorámica increíble)
- Las Calles Coloniales (para caminar y admirar la arquitectura)
    
¿Quieres que te dé más detalles sobre algún lugar en específico? puedo mostrarte nuestro mapa interactivo o el directorio completo.`;
  }
  
  if (message.includes('comida') || message.includes('comer') || message.includes('restaurante')) {
    return `¡Buena elección! Real del Monte tiene una gastronomía deliciosa. 🍴
    
No te puedes perder:
- El Platillo típico: Paste (empanada inglesa) 
- Carnitas y barbacoa
- Dulces tradicionales
    
Visita nuestro directorio de negocios para ver todos los restaurantes y cafés. ¿Quieres que te muestre las opciones?`;
  }
  
  if (message.includes('ruta') || message.includes('caminar') || message.includes('senderismo')) {
    return `¡Perfecto para los amantes del naturaleza! 🥾
    
Real del Monte tiene rutas espectaculares:
- Rutas de ecoturismo por el bosque
- Caminatas hasta puntos panorámicos
- Rutas nocturnas para ver las estrellas
    
¿Cuál tipo de experiencia prefieres? Puedo mostrarte todas las rutas disponibles.`;
  }
  
  if (message.includes('evento') || message.includes('festival')) {
    return `¡Excelente! Real del Monte siempre tiene eventos interesantes. 🎊
    
Te recomiendo revisar nuestra sección de eventos para ver las próximas fechas:
- Festivales culturales
- Eventos gastronómicos
- Celebraciones tradicionales
    
¿Quieres que te muestre los próximos eventos programados?`;
  }
  
  // Default response
  return `Gracias por tu mensaje. 😊
  
Soy REALITO y estoy aquí para ayudarte a descubrir todo lo que Real del Monte tiene para ofrecerte.
    
Puedes preguntarme sobre:
- 🏛️ Lugares turísticos
- 🍽️ Dónde comer y comprar
- 🎉 Próximos eventos
- 🥾 Rutas y senderos
- 📜 Historia y cultura
    
¿Qué te gustaría saber?`;
}

export default router;
