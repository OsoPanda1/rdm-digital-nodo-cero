import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const BASE_URL = process.env.FRONTEND_URL || 'https://real-del-monte.com';

// GET /api/seo/sitemap.xml - Dynamic sitemap generation
router.get('/sitemap.xml', async (req: Request, res: Response, next) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || BASE_URL;
    
    // Fetch all active content
    const [
      businesses,
      events,
      posts,
      routes,
      markers
    ] = await Promise.all([
      prisma.business.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true }
      }),
      prisma.event.findMany({
        where: { isActive: true },
        select: { id: true, startDate: true }
      }),
      prisma.post.findMany({
        where: { isHidden: false },
        select: { id: true, createdAt: true }
      }),
      prisma.route.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true }
      }),
      prisma.marker.findMany({
        where: { isActive: true },
        select: { id: true, category: true, updatedAt: true }
      })
    ]);

    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/lugares', priority: '0.9', changefreq: 'weekly' },
      { url: '/directorio', priority: '0.9', changefreq: 'weekly' },
      { url: '/eventos', priority: '0.9', changefreq: 'weekly' },
      { url: '/rutas', priority: '0.8', changefreq: 'weekly' },
      { url: '/historia', priority: '0.7', changefreq: 'monthly' },
      { url: '/cultura', priority: '0.7', changefreq: 'monthly' },
      { url: '/gastronomia', priority: '0.8', changefreq: 'weekly' },
      { url: '/comunidad', priority: '0.7', changefreq: 'weekly' },
      { url: '/mapa', priority: '0.8', changefreq: 'monthly' },
      { url: '/apoya', priority: '0.6', changefreq: 'monthly' }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`).join('')}
  ${businesses.map(b => `
  <url>
    <loc>${baseUrl}/directorio/${b.id}</loc>
    <lastmod>${b.updatedAt.toISOString()}</lastmod>
    <priority>0.7</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
  ${events.filter(e => e.startDate > new Date()).map(e => `
  <url>
    <loc>${baseUrl}/eventos/${e.id}</loc>
    <lastmod>${e.startDate.toISOString()}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
  ${posts.map(p => `
  <url>
    <loc>${baseUrl}/comunidad/${p.id}</loc>
    <lastmod>${p.createdAt.toISOString()}</lastmod>
    <priority>0.6</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('')}
  ${routes.map(r => `
  <url>
    <loc>${baseUrl}/rutas/${r.id}</loc>
    <lastmod>${r.updatedAt.toISOString()}</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>`).join('')}
  ${markers.map(m => `
  <url>
    <loc>${baseUrl}/lugares/${m.id}</loc>
    <lastmod>${m.updatedAt.toISOString()}</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>`).join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    next(error);
  }
});

// GET /api/seo/robots.txt - Robots.txt generation
router.get('/robots.txt', async (req: Request, res: Response, next) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || BASE_URL;
    const isProduction = process.env.NODE_ENV === 'production';

    let robotsTxt = `# Robots.txt for RDM Digital
User-agent: *
`;

    if (isProduction) {
      robotsTxt += `
# Allow crawling of public content
Allow: /
Disallow: /api/
Disallow: /auth/
Disallow: /admin/

# Sitemap
Sitemap: ${baseUrl}/api/seo/sitemap.xml
`;
    } else {
      // Staging/development - disallow everything
      robotsTxt += `
# Disallow all in non-production
Disallow: /
`;
    }

    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  } catch (error) {
    next(error);
  }
});

// GET /api/seo/schema/:type - JSON-LD Schema.org generation
router.get('/schema/:type', async (req: Request, res: Response, next) => {
  try {
    const { type } = req.params;
    const { id } = req.query;
    const baseUrl = process.env.FRONTEND_URL || BASE_URL;

    let schema: any = null;

    switch (type) {
      case 'business': {
        if (!id) {
          throw new AppError('Business ID required', 400);
        }
        const business = await prisma.business.findFirst({
          where: { id: id as string, isActive: true }
        });
        
        if (business) {
          schema = {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: business.name,
            description: business.description,
            address: {
              '@type': 'PostalAddress',
              streetAddress: business.address || ''
            },
            telephone: business.phone || '',
            email: business.email || '',
            url: business.website || `${baseUrl}/directorio/${business.id}`,
            image: business.imageUrl || '',
            geo: business.latitude && business.longitude ? {
              '@type': 'GeoCoordinates',
              latitude: business.latitude,
              longitude: business.longitude
            } : undefined,
            priceRange: '$$',
            servesCuisine: business.category,
            openingHoursSpecification: [] // Could be added if business hours are stored
          };
        }
        break;
      }

      case 'event': {
        if (!id) {
          throw new AppError('Event ID required', 400);
        }
        const event = await prisma.event.findFirst({
          where: { id: id as string, isActive: true }
        });
        
        if (event) {
          schema = {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.title,
            description: event.description,
            startDate: event.startDate.toISOString(),
            endDate: event.endDate?.toISOString(),
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: {
              '@type': 'Place',
              name: event.location,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Real del Monte',
                addressRegion: 'Hidalgo',
                addressCountry: 'MX'
              }
            },
            image: event.imageUrl || '',
            organizer: {
              '@type': 'Organization',
              name: 'RDM Digital',
              url: baseUrl
            }
          };
        }
        break;
      }

      case 'place':
      case 'marker': {
        if (!id) {
          throw new AppError('Marker ID required', 400);
        }
        const marker = await prisma.marker.findFirst({
          where: { id: id as string, isActive: true }
        });
        
        if (marker) {
          schema = {
            '@context': 'https://schema.org',
            '@type': 'TouristAttraction',
            name: marker.name,
            description: marker.description || '',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Real del Monte',
              addressRegion: 'Hidalgo',
              addressCountry: 'MX'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: marker.lat,
              longitude: marker.lng
            },
            image: marker.imageUrl || '',
            isAccessibleForFree: true
          };
        }
        break;
      }

      case 'route': {
        if (!id) {
          throw new AppError('Route ID required', 400);
        }
        const route = await prisma.route.findFirst({
          where: { id: id as string, isActive: true },
          include: { points: { orderBy: { order: 'asc' } } }
        });
        
        if (route) {
          const geoCoordinates = route.points.map(p => ({
            '@type': 'GeoCoordinates',
            latitude: p.latitude,
            longitude: p.longitude
          }));

          schema = {
            '@context': 'https://schema.org',
            '@type': 'TouristRoute',
            name: route.name,
            description: route.description,
            routePoints: route.points.map(p => ({
              '@type': 'TouristAttraction',
              name: p.name,
              description: p.description
            })),
            totalTime: `PT${route.durationMinutes}M`,
            distance: route.distanceKm ? {
              '@type': 'Distance',
              value: route.distanceKm,
              unitCode: 'KMT'
            } : undefined,
            difficulty: route.difficulty.charAt(0).toUpperCase() + route.difficulty.slice(1),
            isFamilyFriendly: route.isFamilyFriendly,
            image: route.imageUrl || ''
          };
        }
        break;
      }

      case 'organization': {
        schema = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'RDM Digital - Real del Monte',
          description: 'Plataforma turística digital del Pueblo Mágico de Real del Monte, Hidalgo, México',
          url: baseUrl,
          logo: `${baseUrl}/assets/logo-rdm.png`,
          sameAs: [
            'https://www.facebook.com/RealDelMonteTurismo',
            'https://www.instagram.com/realdelmonte',
            'https://twitter.com/RealDelMonte'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'info@real-del-monte.com',
            availableLanguage: ['Spanish', 'English']
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Real del Monte',
            addressRegion: 'Hidalgo',
            addressCountry: 'MX'
          }
        };
        break;
      }

      case 'website': {
        schema = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'RDM Digital - Real del Monte',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/buscar?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        };
        break;
      }

      default:
        throw new AppError('Invalid schema type', 400);
    }

    if (!schema) {
      throw new AppError('Content not found', 404);
    }

    res.json({
      success: true,
      data: schema
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/seo/meta - Get SEO meta tags for a page
router.get('/meta', async (req: Request, res: Response, next) => {
  try {
    const { type, id } = req.query;
    const baseUrl = process.env.FRONTEND_URL || BASE_URL;

    if (!type) {
      throw new AppError('Type parameter required', 400);
    }

    let meta = {
      title: 'RDM Digital - Real del Monte',
      description: 'Descubre Real del Monte, un hermoso Pueblo Mágico en Hidalgo, México. Explora lugares turísticos, eventos, rutas de senderismo y más.',
      image: `${baseUrl}/assets/hero-real-del-monte.webp`,
      url: baseUrl,
      type: 'website' as const
    };

    switch (type) {
      case 'business': {
        const business = await prisma.business.findFirst({
          where: { id: id as string, isActive: true }
        });
        if (business) {
          meta = {
            title: `${business.name} - RDM Digital`,
            description: business.description.slice(0, 160),
            image: business.imageUrl || meta.image,
            url: `${baseUrl}/directorio/${business.id}`,
            type: 'business'
          };
        }
        break;
      }

      case 'event': {
        const event = await prisma.event.findFirst({
          where: { id: id as string, isActive: true }
        });
        if (event) {
          meta = {
            title: `${event.title} - RDM Digital`,
            description: event.description.slice(0, 160),
            image: event.imageUrl || meta.image,
            url: `${baseUrl}/eventos/${event.id}`,
            type: 'event'
          };
        }
        break;
      }

      case 'place':
      case 'marker': {
        const marker = await prisma.marker.findFirst({
          where: { id: id as string, isActive: true }
        });
        if (marker) {
          meta = {
            title: `${marker.name} - RDM Digital`,
            description: marker.description?.slice(0, 160) || meta.description,
            image: marker.imageUrl || meta.image,
            url: `${baseUrl}/lugares/${marker.id}`,
            type: 'place'
          };
        }
        break;
      }

      case 'route': {
        const route = await prisma.route.findFirst({
          where: { id: id as string, isActive: true }
        });
        if (route) {
          meta = {
            title: `Ruta ${route.name} - RDM Digital`,
            description: route.description.slice(0, 160),
            image: route.imageUrl || meta.image,
            url: `${baseUrl}/rutas/${route.id}`,
            type: 'route'
          };
        }
        break;
      }

      case 'post': {
        const post = await prisma.post.findFirst({
          where: { id: id as string, isHidden: false },
          include: { user: { select: { name: true } } }
        });
        if (post) {
          meta = {
            title: `Recuerdo en ${post.placeName} - RDM Digital`,
            description: post.content.slice(0, 160),
            image: post.imageUrl || meta.image,
            url: `${baseUrl}/comunidad/${post.id}`,
            type: 'article'
          };
        }
        break;
      }
    }

    res.json({
      success: true,
      data: meta
    });
  } catch (error) {
    next(error);
  }
});

export default router;
