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

// Real del Monte and Hidalgo tourism knowledge base
const KNOWLEDGE_BASE = {
  history: {
    realDelMonte: `Real del Monte es un Pueblo Mágico ubicado en el estado de Hidalgo, México. 
Es conocido por su arquitectura colonial inglesa, siendo el único pueblo en México con criptas victorianas.
Su principal atractivo es el Panteón Inglés, fundado en 1861 por la compañía minera British.
La minería fue la actividad económica principal desde la época colonial hasta el siglo XX.`,
    
    mining: `La minería en Real del Monte tiene una historia que remonta a la época prehispánica.
Los españoles explotaron las minas de plata desde el siglo XVI.
En el siglo XIX, compañías británicas como la British Mining Company transformaron la zona.
La Mina de Acosta es uno de los atractivos turísticos más importantes, ofreciendo recorridos por tunnels históricos.`,
    
    paste: `El paste es el plato típico de Real del Monte. 
Es una empanada de carne molida, papa y Species que llegó con los mineros británicos en el siglo XIX.
Se hornea en hornos de barro y es diferente a cualquier otra empanada mexicana.
Puedes encontrar los mejores pastes en la calle del Paste, cerca del centro.`
  },
  
  places: [
    {
      name: "Panteón Inglés",
      category: "historia",
      description: "Cementerio victoriano con criptas únicas en México, fundado en 1861",
      location: "Centro de Real del Monte",
      schedule: "9:00 - 18:00",
      tips: "Visitar durante el Día de Muertos es una experiencia única"
    },
    {
      name: "Mina de Acosta",
      category: "aventura",
      description: "Recorrido por tunnels mineros históricos con guías locales",
      location: "Carretera a Omitlán",
      schedule: "10:00 - 17:00",
      tips: "Llevar calzado cómodo y chamarra (hace frío dentro)"
    },
    {
      name: "Parroquia de San Francisco",
      category: "cultura",
      description: "Iglesia colonial del siglo XVI con arquitectura única",
      location: "Plaza Principal",
      schedule: "7:00 - 20:00",
      tips: "Entrada gratuita"
    },
    {
      name: "Mirador Vista del Peñón",
      category: "naturaleza",
      description: "Punto panorámico con vista a todo el valle",
      location: "Cerro del Peñón",
      schedule: "24 horas",
      tips: "Mejor visitar al atardecer"
    },
    {
      name: "Calles Coloniales",
      category: "cultura",
      description: "Caminata por calles empedradas con arquitectura inglesa",
      location: "Centro Histórico",
      schedule: "24 horas",
      tips: "Ideal para fotografías"
    },
    {
      name: "Museo de Mineralogía",
      category: "cultura",
      description: "Colección de minerales de la región",
      location: "Casa de la Cultura",
      schedule: "10:00 - 17:00",
      tips: "Entrada gratuita"
    }
  ],
  
  routes: [
    {
      name: "Ruta Histórica",
      description: "Recorrido por los sitios históricos y coloniales",
      duration: "2-3 horas",
      difficulty: "Fácil",
      highlights: ["Panteón Inglés", "Calles Coloniales", "Parroquia"]
    },
    {
      name: "Ruta de Senderismo",
      description: "Caminata por senderos naturales",
      duration: "3-4 horas",
      difficulty: "Media",
      highlights: ["Mirador Vista del Peñón", "Bosque de pinos"]
    },
    {
      name: "Ruta del Paste",
      description: "Gastronomía local",
      duration: "2 horas",
      difficulty: "Fácil",
      highlights: ["Calle del Paste", "Mercado Municipal"]
    }
  ],
  
  events: [
    {
      name: "Festival del Paste",
      month: "Abril",
      description: "Celebración del plato típico con competencias y actividades"
    },
    {
      name: "Noche de Rábanos",
      month: "Diciembre",
      description: "Tradición decembrina con figuras de rábano"
    },
    {
      name: "Día de Muertos",
      month: "Noviembre",
      description: "Celebración única con influencia inglesa en el Panteón Inglés"
    }
  ],
  
  nearby: [
    {
      name: "Huasca de Ocampo",
      distance: "25 km",
      description: "Pueblo mágico con prismas basálticos y bosque de оси"
    },
    {
      name: "Pachuca",
      distance: "15 km",
      description: "Capital de Hidalgo, conocida como 'La Bella Airosa'"
    },
    {
      name: "Mineral del Chico",
      distance: "20 km",
      description: "Pueblo mágico de montaña con actividades de aventura"
    }
  ]
};

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
        actions: aiResponse.actions,
        knowledgeBase: aiResponse.knowledgeBase
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

// POST /api/ai/chat - Simplified chat endpoint
router.post('/chat', optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!message) {
      throw new AppError('Message is required', 400);
    }

    // Rate limiting
    const identifier = req.user?.id || req.ip || 'anonymous';
    if (!checkRateLimit(identifier)) {
      throw new AppError('Rate limit exceeded. Please try again later.', 429);
    }

    // Get context data
    const contextData = await getContextData();
    
    // Generate response with context and history
    const aiResponse = await generateAIResponse(message, contextData, { history });

    res.json({
      success: true,
      data: {
        message: aiResponse.message,
        actions: aiResponse.actions,
        context: {
          places: contextData.businesses.slice(0, 3),
          events: contextData.events.slice(0, 2)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/ai/info - Get Realito AI information
router.get('/info', async (req: Request, res: Response, next) => {
  try {
    res.json({
      success: true,
      data: {
        name: "REALITO",
        role: "Asistente Turístico Virtual de RDM Digital",
        description: "Soy tu guía turístico virtual para descubrir Real del Monte y sus alrededores",
        capabilities: [
          "Información sobre lugares turísticos",
          "Recomendaciones de restaurantes y negocios",
          "Detalles sobre eventos y festividades",
          "Rutas de senderismo y aventura",
          "Historia y cultura local",
          "Consejos prácticos para tu visita"
        ],
        knowledgeBase: {
          places: KNOWLEDGE_BASE.places.length,
          routes: KNOWLEDGE_BASE.routes.length,
          events: KNOWLEDGE_BASE.events.length,
          nearby: KNOWLEDGE_BASE.nearby.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to get context data for AI
async function getContextData() {
  try {
    const [businesses, events, routes, markers] = await Promise.all([
      prisma.business.findMany({
        where: { isActive: true },
        select: { name: true, category: true, description: true, address: true },
        take: 10
      }),
      prisma.event.findMany({
        where: { isActive: true, startDate: { gte: new Date() } },
        select: { title: true, description: true, location: true, startDate: true },
        take: 5
      }),
      prisma.route.findMany({
        where: { isActive: true },
        select: { name: true, description: true, difficulty: true, durationMinutes: true, isFamilyFriendly: true },
        take: 5
      }),
      prisma.marker.findMany({
        where: { isActive: true },
        select: { name: true, category: true, description: true, lat: true, lng: true },
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
): Promise<{ message: string; actions?: any[]; knowledgeBase?: any }> {
  
  // Check if OpenAI is configured
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (openaiApiKey) {
    try {
      // Use OpenAI API
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: openaiApiKey });
      
      const systemPrompt = `Eres REALITO, el asistente virtual turístico oficial de RDM Digital (Real del Monte), un hermoso Pueblo Mágico en el estado de Hidalgo, México.

Tu rol es ayudar a turistas y visitantes a descubrir los mejores lugares, experiencias, eventos y rutas en Real del Monte y sus alrededores en Hidalgo.

## HISTORIA DE REAL DEL MONTE
${KNOWLEDGE_BASE.history.realDelMonte}

## HISTORIA MINERA
${KNOWLEDGE_BASE.history.mining}

## GASTRONOMÍA - EL PASTE
${KNOWLEDGE_BASE.history.paste}

## LUGARES TURÍSTICOS
${JSON.stringify(KNOWLEDGE_BASE.places, null, 2)}

## RUTAS TURÍSTICAS
${JSON.stringify(KNOWLEDGE_BASE.routes, null, 2)}

## EVENTOS
${JSON.stringify(KNOWLEDGE_BASE.events, null, 2)}

## LUGARES CERCANOS
${JSON.stringify(KNOWLEDGE_BASE.nearby, null, 2)}

## NEGOCIOS LOCALES (Base de datos)
${JSON.stringify(contextData.businesses)}

## EVENTOS PRÓXIMOS (Base de datos)
${JSON.stringify(contextData.events)}

## RUTAS (Base de datos)
${JSON.stringify(contextData.routes)}

## LUGARES/MARKERS (Base de datos)
${JSON.stringify(contextData.markers)}

## INSTRUCCIONES
1. Responde SIEMPRE en español de manera amigable, cálida y útil
2. Proporciona información específica basada en los datos disponibles
3. Si no tienes información precisa, sugiere que el usuario visite nuestro directorio o contacte directamente
4. Recomienda lugares, eventos y rutas relevantes según el interés del usuario
5. Incluye información práctica como horarios, ubicaciones y recomendaciones
6. Menciona la distancia aproximada y cómo llegar cuando sea relevante
7. Cuando sea apropiado, sugiere acciones como ver más detalles, ver en el mapa, o navegar a páginas específicas
8. Incluye datos curiosos e información histórica cuando sea apropiado
9. Sé entusiasta sobre Real del Monte - es un lugar mágico con mucha historia

${customContext?.history ? `HISTORIAL DE CONVERSACIÓN:\n${JSON.stringify(customContext.history.slice(-5))}` : ''}

Responde de manera concisa pero informativa, usando emojis cuando sea apropiado.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      return {
        message: completion.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta en este momento.',
        actions: generateActions(userMessage),
        knowledgeBase: KNOWLEDGE_BASE
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fall through to fallback
    }
  }
  
  // Fallback response without AI
  return {
    message: generateFallbackResponse(userMessage),
    actions: generateActions(userMessage),
    knowledgeBase: KNOWLEDGE_BASE
  };
}

// Generate suggested actions based on user message
function generateActions(userMessage: string): any[] {
  const message = userMessage.toLowerCase();
  const actions = [];
  
  if (message.includes('lugar') || message.includes('visitar') || message.includes('que hay') || message.includes('donde')) {
    actions.push({ type: 'navigation', label: 'Ver Lugares', path: '/lugares' });
    actions.push({ type: 'navigation', label: 'Ver Mapa', path: '/mapa' });
  }
  
  if (message.includes('negocio') || message.includes('comer') || message.includes('comprar') || message.includes('restaurante') || message.includes('hotel')) {
    actions.push({ type: 'navigation', label: 'Ver Directorio', path: '/directorio' });
  }
  
  if (message.includes('evento') || message.includes('que pasa') || message.includes('festival')) {
    actions.push({ type: 'navigation', label: 'Ver Eventos', path: '/eventos' });
  }
  
  if (message.includes('ruta') || message.includes('caminar') || message.includes('recorrer') || message.includes('senderismo')) {
    actions.push({ type: 'navigation', label: 'Ver Rutas', path: '/rutas' });
  }
  
  if (message.includes('historia') || message.includes('cultura') || message.includes('museo')) {
    actions.push({ type: 'navigation', label: 'Ver Historia', path: '/historia' });
    actions.push({ type: 'navigation', label: 'Ver Cultura', path: '/cultura' });
  }

  if (message.includes('paste') || message.includes('comida') || message.includes('gastronomía')) {
    actions.push({ type: 'navigation', label: 'Ver Gastronomía', path: '/gastronomia' });
  }
  
  return actions.slice(0, 3);
}

// Generate fallback response when AI is not available
function generateFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Greetings
  if (message.includes('hola') || message.includes('buenos') || message.includes('que tal') || message.includes('buenas')) {
    return `¡Hola! 👋 ¡Bienvenido a Real del Monte! 🏔️

Soy **REALITO**, tu asistente turístico virtual de RDM Digital. Estoy aquí para ayudarte a descubrir todo lo que este hermoso Pueblo Mágico tiene para ti.

🌿 **¿Qué puedo hacer por ti?**

🗺️ **Lugares turísticos** - Desde el famoso Panteón Inglés hasta miradores espectaculares
🍽️ **Gastronomía** - No te pierdas el famoso *paste* de Real del Monte
🥾 **Rutas** - Senderismo, ecoturismo y aventuras
🎉 **Eventos** - Festivales, tradiciones y más
📜 **Historia** - La fascinante herencia minera y colonial

Real del Monte es un lugar único en México, con arquitectura victoriana inglesa y una historia minera fascinante.

¡Pregúntame lo que quieras sobre Real del Monte! 😊`;
  }
  
  // About places
  if (message.includes('lugar') || message.includes('visitar') || message.includes('que hacer')) {
    return `¡Qué excelente que quieras explorar Real del Monte! 🌄

Estos son algunos lugares imperdibles:

🏛️ **Panteón Inglés** - El único cementerio victoriano en México, fundado en 1861 por mineros británicos. Es famoso por sus cryptas victorianas únicas.

⛏️ **Mina de Acosta** - Recorre los tunnels históricos de una mina centenaria. Una experiencia fascinante!

📍 **Mirador Vista del Peñón** - La mejor vista panorámica del valle. Ideal al atardecer 🚢

🏘️ **Calles Coloniales** - Camina por calles empedradas con arquitectura inglesa única en México

⛪ **Parroquia de San Francisco** - Iglesia colonial del siglo XVI

¿Quieres más detalles sobre alguno de estos lugares? ¿O prefieres que te recomiende algo específico según tus intereses?`;
  }

  // About food/paste
  if (message.includes('comida') || message.includes('comer') || message.includes('restaurante') || message.includes('paste')) {
    return `¡Buena elección! La gastronomía de Real del Monte es deliciosa. 🍴

🌟 **El Paste** - Es el plato típico y es único en el mundo! 
Es una empanada de carne molida, papa y especies, horneada en hornos de barro. Llegó con los mineros británicos en el siglo XIX y se popularizó como el \"paste inglés\".

Puedes encontrar los mejores pastes en la calle del Paste, cerca del centro del pueblo.

Otros platos que no puedes perder:
- Carnitas y barbacoa de la región
- Dulces tradicionales mexicanos
- Café de olla en los cafes locales

¿Quieres que te muestre nuestro directorio de restaurantes? 🍽️`;
  }

  // About routes
  if (message.includes('ruta') || message.includes('caminar') || message.includes('senderismo') || message.includes('caminata')) {
    return `¡Perfecto para los amantes del naturaleza! 🥾

Real del Monte tiene rutas espectaculares:

🥾 **Ruta Histórica** (2-3 horas, Fácil)
Caminata por el centro histórico, Panteón Inglés y calles coloniales

🌲 **Ruta de Senderismo** (3-4 horas, Media)
Senderos naturales hacia el Mirador Vista del Peñón

🥖 **Ruta del Paste** (2 horas, Fácil)
Gastronomía local - combina turismo con culinary

🌙 **Ruta Nocturna** 
Para ver las estrellas - Real del Monte tiene cielos despejados increíbles

También puedes visitar lugares cercanos como Huasca de Ocampo (25 km) con sus famosos prismas basálticos.

¿Cuál tipo de experiencia prefieres? Puedo mostrarte todas las rutas disponibles.`;
  }

  // About events
  if (message.includes('evento') || message.includes('festival') || message.includes('cuando')) {
    return `¡Excelente! Real del Monte siempre tiene eventos interesantes. 🎊

**Eventos principales:**

🥧 **Festival del Paste** (Abril)
Celebración del plato típico con competencias y actividades culturales

💀 **Día de Muertos** (Noviembre)
Celebración única con influencia inglesa en el Panteón Inglés - una experiencia unforgettable

🥕 **Noche de Rábanos** (Diciembre)
Tradición decembrina con figuras de rábano的艺术

**Otros eventos**:
- Festivales culturales
- Eventos gastronómicos
- Celebraciones tradicionales
- Ferias patronales

¿Quieres que te muestre los próximos eventos programados en nuestro calendario?`;
  }

  // About history
  if (message.includes('historia') || message.includes('origen') || message.includes('mina')) {
    return `¡Excelente! La historia de Real del Monte es fascinante! 📜

**Origen Minero:**
La minería en Real del Monte remonta a la época prehispánica. Los españoles explotaron las minas de plata desde el siglo XVI.

**Llegada de los Británicos:**
En el siglo XIX, compañías mineras británicas llegaron a la región y transformaron todo. Fundaron el Panteón Inglés en 1861, único en su tipo en México.

**Arquitectura Victoriana:**
Real del Monte es el único pueblo en México con arquitectura victoriana inglesa genuína. Las casas, calles e incluso la iglesia reflejan esta herencia.

**El Paste:**
Los mineros británicos trajeron la receta del paste, que se adaptó a los ingredientes locales y se convirtió en el plato típico de la región.

¿Quieres saber más sobre algún aspecto específico de nuestra historia?`;
  }

  // About nearby/other towns
  if (message.includes('cerca') || message.includes('cercano') || message.includes('alrededor') || message.includes('pueblo')) {
    return `Real del Monte está rodeado de otros Pueblo Mágicos espectaculares! 🌟

**Lugares cercanos que puedes visitar:**

🚗 **Huasca de Ocampo** (25 km)
- Famoso por los **Prismas Basálticos** - formaciones de roca hexagonal únicas
- Bosque de оси donde puedes hacer tirolesa
- Laguna de Santa María

🏔️ **Mineral del Chico** (20 km)
- Pueblo de montaña
- Increíbles rutas de ecoturismo
- Views spectaculars

🌬️ **Pachuca** (15 km)
- Capital de Hidalgo
- Llamada "La Bella Airosa"
- Centro histórico colonial

¿Quieres información sobre cómo llegar a alguno de estos lugares?`;
  }

  // Default response
  return `Gracias por tu mensaje. 😊

Soy **REALITO** y estoy aquí para ayudarte a descubrir todo lo que Real del Monte tiene para ofrecerte.

Puedes preguntarme sobre:
- 🏛️ **Lugares turísticos** - Qué visitar
- 🍽️ **Dónde comer** - Restaurantes, el famoso paste
- 🥾 **Rutas y senderismo** - Para caminar y explorar
- 🎉 **Eventos** - Festejos y festividades
- 📜 **Historia** - La rica herencia minera y colonial
- 🚗 **Alrededores** - Pueblo Mágicos cercanos

¿Qué te gustaría saber sobre Real del Monte? 🏔️`;
}

export default router;
