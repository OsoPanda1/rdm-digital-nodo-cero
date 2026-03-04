import { useEffect } from 'react';

interface SEOMetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
}

const DEFAULT_META = {
  title: 'RDM Digital - Real del Monte | Pueblo Mágico',
  description: 'Explora Real del Monte, Hidalgo: historia, cultura, ecoturismo, gastronomía y más. Descubre los mejores lugares, eventos y rutas turísticas.',
  image: '/og-image.jpg',
  siteName: 'RDM Digital',
};

export function SEOMeta({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
}: SEOMetaProps) {
  const fullTitle = title ? `${title} | ${DEFAULT_META.siteName}` : DEFAULT_META.title;
  const metaDescription = description || DEFAULT_META.description;
  const metaImage = image || DEFAULT_META.image;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const metaTags = [
      { name: 'description', content: metaDescription },
      { name: 'keywords', content: 'Real del Monte, Pueblo Mágico, Hidalgo, turismo, ecoturismo, lugares turísticos, eventos, rutas, historia, cultura' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: metaDescription },
      { property: 'og:image', content: metaImage },
      { property: 'og:type', content: type },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: DEFAULT_META.siteName },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: metaDescription },
      { name: 'twitter:image', content: metaImage },
    ];

    // Remove existing meta tags and add new ones
    metaTags.forEach(tag => {
      // Check if tag already exists
      let element: HTMLMetaElement | null = null;
      
      if (tag.name) {
        element = document.querySelector(`meta[name="${tag.name}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.name = tag.name;
          document.head.appendChild(element);
        }
      } else if (tag.property) {
        element = document.querySelector(`meta[property="${tag.property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setProperty('property', tag.property);
          document.head.appendChild(element);
        }
      }
      
      if (element) {
        element.content = tag.content;
      }
    });

    // Add canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Add JSON-LD structured data for organization
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'RDM Digital',
      description: metaDescription,
      url: canonicalUrl,
      logo: metaImage,
      sameAs: [
        'https://facebook.com/rdmdigital',
        'https://instagram.com/rdmdigital',
        'https://twitter.com/rdmdigital',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+52-771-000-0000',
        contactType: 'customer service',
        areaServed: 'MX',
        availableLanguage: 'Spanish',
      },
    };

    let scriptEl = document.querySelector('script[type="application/ld+json"]');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);

    // Cleanup function
    return () => {
      // We don't remove elements on unmount as they're part of the SPA
    };
  }, [fullTitle, metaDescription, metaImage, canonicalUrl, type]);

  return null;
}

// Page-specific SEO configurations
export const PAGE_SEO = {
  home: {
    title: 'RDM Digital - Descubre Real del Monte',
    description: 'Tu guía completa para explorar Real del Monte, Hidalgo. Historia, cultura, ecoturismo, gastronomía, eventos y más.',
  },
  lugares: {
    title: 'Lugares Turísticos - Real del Monte',
    description: 'Descubre los lugares más Hermosos de Real del Monte: Mina de Acosta, Panteón Inglés, miradores y más.',
  },
  directorio: {
    title: 'Directorio de Negocios - RDM Digital',
    description: 'Encuentra restaurantes, hoteles, tiendas y servicios en Real del Monte. Apoya los negocios locales.',
  },
  eventos: {
    title: 'Eventos y Actividades - Real del Monte',
    description: 'Consulta los próximos eventos, festivales y actividades en Real del Monte.',
  },
  comunidad: {
    title: 'Comunidad - Comparte tu Experiencia',
    description: 'Comparte tus fotos, historias y experiencias en Real del Monte con nuestra comunidad de viajeros.',
  },
  historia: {
    title: 'Historia de Real del Monte',
    description: 'Descubre la rica historia de Real del Monte, desde la época colonial hasta nuestros días.',
  },
  cultura: {
    title: 'Cultura y Tradiciones - Real del Monte',
    description: 'Explora la cultura y tradiciones del Pueblo Mágico de Real del Monte, Hidalgo.',
  },
  rutas: {
    title: 'Rutas Turísticas - Explora Real del Monte',
    description: 'Descubre las mejores rutas de senderismo y caminatas en Real del Monte.',
  },
  gastronomia: {
    title: 'Gastronomía - Sabores de Real del Monte',
    description: 'Descubre la gastronomía de Real del Monte: el tradicional paste, carnitas y más.',
  },
  ecoturismo: {
    title: 'Ecoturismo - Naturaleza en Real del Monte',
    description: 'Explora la naturaleza de Real del Monte: bosques, miradores y rutas de aventura.',
  },
  arte: {
    title: 'Arte y Artesanías - Real del Monte',
    description: 'Descubre el arte local y las artesanías tradicionales de Real del Monte.',
  },
  mapa: {
    title: 'Mapa Interactivo - Real del Monte',
    description: 'Explora Real del Monte con nuestro mapa interactivo. Encuentra lugares, negocios y rutas.',
  },
  auth: {
    title: 'Iniciar Sesión - RDM Digital',
    description: 'Inicia sesión o regístrate en RDM Digital para guardar tus lugares favoritos y más.',
  },
  reglamento: {
    title: 'Reglamento - Normas de la Comunidad',
    description: 'Normas y políticas de la comunidad RDM Digital. Participación respetuosa.',
  },
};

export default SEOMeta;
