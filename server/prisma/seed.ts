import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rdm.digital' },
    update: {},
    create: {
      name: 'Administrador RDM',
      email: 'admin@rdm.digital',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create tourist user
  const touristPassword = await bcrypt.hash('tourist123', 12);
  const tourist = await prisma.user.upsert({
    where: { email: 'tourist@example.com' },
    update: {},
    create: {
      name: 'Turista Ejemplo',
      email: 'tourist@example.com',
      passwordHash: touristPassword,
      role: 'tourist',
      touristProfile: {
        create: {
          homeCity: 'Ciudad de México',
          travelStyle: 'adventure',
          language: 'es',
        },
      },
    },
  });
  console.log('✅ Tourist user created:', tourist.email);

  // Create business owners
  const businessOwners = [];
  const ownerPasswords = ['negocio123', 'cafe123', 'hotel123'];
  const ownerData = [
    { name: 'Juan Pérez', email: 'juan@minacoffee.com' },
    { name: 'María García', email: 'maria@hotelreal.com' },
    { name: 'Carlos López', email: 'carlos@artesaniasrdm.com' },
  ];

  for (let i = 0; i < ownerData.length; i++) {
    const owner = await prisma.user.upsert({
      where: { email: ownerData[i].email },
      update: {},
      create: {
        name: ownerData[i].name,
        email: ownerData[i].email,
        passwordHash: await bcrypt.hash(ownerPasswords[i], 12),
        role: 'business_owner',
      },
    });
    businessOwners.push(owner);
  }
  console.log('✅ Business owners created');

  // Create markers (places)
  const places = [
    { name: 'Panteón Inglés', category: 'culture' as const, lat: 20.1397, lng: -98.6769, description: 'Famoso panteón victoriano con criptas únicas' },
    { name: 'Mina de Acosta', category: 'site' as const, lat: 20.1428, lng: -98.6833, description: ' Mina histórica para tours subterráneos' },
    { name: 'Vista del Peñón', category: 'viewpoint' as const, lat: 20.1511, lng: -98.6694, description: 'Panorámica espectacular del pueblo' },
    { name: 'Parroquia de San Pedro', category: 'culture' as const, lat: 20.1383, lng: -98.6756, description: 'Iglesia colonial del siglo XVIII' },
    { name: 'Plaza de la Constitución', category: 'site' as const, lat: 20.1389, lng: -98.6750, description: 'Centro histórico del pueblo' },
    { name: 'Calles Coloniales', category: 'site' as const, lat: 20.1392, lng: -98.6744, description: 'Caminata por calles empedradas históricas' },
    { name: 'Mirador del Atardecer', category: 'viewpoint' as const, lat: 20.1489, lng: -98.6711, description: 'Mejor lugar para ver el atardecer' },
    { name: 'Bosque de pinos', category: 'nature' as const, lat: 20.1556, lng: -98.6856, description: 'Área natural para senderismo' },
    { name: 'Mercado Artesanal', category: 'business' as const, lat: 20.1378, lng: -98.6767, description: 'Tienda de artesanías locales' },
    { name: 'Parque Central', category: 'nature' as const, lat: 20.1394, lng: -98.6756, description: 'Parque con áreas verdes y juegos' },
  ];

  for (const place of places) {
    await prisma.marker.upsert({
      where: { id: place.name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        id: place.name.toLowerCase().replace(/ /g, '-'),
        name: place.name,
        category: place.category,
        lat: place.lat,
        lng: place.lng,
        description: place.description,
      },
    });
  }
  console.log('✅ Places/markers created');

  // Create businesses
  const businesses = [
    {
      name: 'Mina Coffee House',
      category: 'Restaurante',
      description: 'Café artesanal y repostería en ambiente colonial. Specialty coffee de altura.',
      phone: '+52 771 123 4567',
      address: 'Calle Principal #25',
      email: 'info@minacoffee.com',
      website: 'https://minacoffee.com',
      lat: 20.1391,
      lng: -98.6752,
      ownerIndex: 0,
      isPremium: true,
    },
    {
      name: 'Hotel Real del Monte',
      category: 'Hotel',
      description: 'Hotel boutique con vista panorámica. Hospedaje tradicional con amenidades modernas.',
      phone: '+52 771 234 5678',
      address: 'Carretera Federal #10',
      email: 'reservas@hotelreal.com',
      website: 'https://hotelreal.com',
      lat: 20.1456,
      lng: -98.6800,
      ownerIndex: 1,
      isPremium: true,
    },
    {
      name: 'Artesanías RDM',
      category: 'Tienda',
      description: 'Artesanías locales auténticas: tapetes, cerámica y productos típicos de la región.',
      phone: '+52 771 345 6789',
      address: 'Plaza Central #8',
      email: 'ventas@artesaniasrdm.com',
      lat: 20.1385,
      lng: -98.6755,
      ownerIndex: 2,
      isPremium: false,
    },
    {
      name: 'La Casa de los Tacos',
      category: 'Restaurante',
      description: 'Autoservicio de tacos tradicionales. Carnitas, barbacoa y lengua.',
      phone: '+52 771 456 7890',
      address: 'Calle Juárez #15',
      lat: 20.1388,
      lng: -98.6748,
      ownerIndex: -1,
      isPremium: false,
    },
    {
      name: 'Pastelería del Pueblo',
      category: 'Repostería',
      description: 'Dulces tradicionales y pasteles caseros. Especialidad en panes de muerto.',
      phone: '+52 771 567 8901',
      address: 'Calle Hidalgo #22',
      lat: 20.1395,
      lng: -98.6760,
      ownerIndex: -1,
      isPremium: false,
    },
    {
      name: 'Eco Aventuras RDM',
      category: 'Actividad',
      description: ' Tours de ecoturismo, rappelling y senderismo guiado.',
      phone: '+52 771 678 9012',
      email: 'info@ecoaventurasrdm.com',
      lat: 20.1500,
      lng: -98.6820,
      ownerIndex: -1,
      isPremium: true,
    },
    {
      name: 'Bar El Portal',
      category: 'Bar',
      description: 'Bar tradicional con música en vivo los fines de semana.',
      phone: '+52 771 789 0123',
      address: 'Calle Miguel Hidalgo #5',
      lat: 20.1382,
      lng: -98.6753,
      ownerIndex: -1,
      isPremium: false,
    },
    {
      name: 'Galería de Arte local',
      category: 'Cultura',
      description: 'Exhibición y venta de arte local y pintura tradicional.',
      phone: '+52 771 890 1234',
      address: 'Plaza de la Constitución #12',
      lat: 20.1390,
      lng: -98.6746,
      ownerIndex: -1,
      isPremium: false,
    },
    {
      name: 'Restaurante Los Portales',
      category: 'Restaurante',
      description: 'Comida típica hidalguense en ambiente colonial.',
      phone: '+52 771 901 2345',
      address: 'Portal de San Pedro #3',
      email: 'reservas@losportales.com',
      lat: 20.1384,
      lng: -98.6758,
      ownerIndex: -1,
      isPremium: true,
    },
    {
      name: 'Tours Históricos RDM',
      category: 'Actividad',
      description: 'Guiados a pie por la historia del Pueblo Mágico.',
      phone: '+52 771 012 3456',
      email: 'tours@rdm.com',
      lat: 20.1392,
      lng: -98.6754,
      ownerIndex: -1,
      isPremium: false,
    },
  ];

  for (let i = 0; i < businesses.length; i++) {
    const b = businesses[i];
    const ownerId = b.ownerIndex >= 0 ? businessOwners[b.ownerIndex]?.id : null;
    
    await prisma.business.upsert({
      where: { id: b.name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        id: b.name.toLowerCase().replace(/ /g, '-'),
        name: b.name,
        category: b.category,
        description: b.description,
        phone: b.phone,
        address: b.address,
        email: b.email,
        website: b.website,
        latitude: b.lat,
        longitude: b.lng,
        ownerId: ownerId || admin.id,
        isPremium: b.isPremium,
      },
    });
  }
  console.log('✅ Businesses created');

  // Create events
  const events = [
    {
      title: 'Festival Cultural Real del Monte',
      description: 'Evento anual con música, danza y arte local. Celebración de la herencia cultural del pueblo.',
      location: 'Plaza de la Constitución',
      startDate: new Date('2026-04-15T18:00:00Z'),
      endDate: new Date('2026-04-17T23:00:00Z'),
      isFeatured: true,
    },
    {
      title: 'Noche de Rutas',
      description: 'Caminata nocturna por las calles históricas con guías disfrazados de época.',
      location: 'Centro Histórico',
      startDate: new Date('2026-04-20T20:00:00Z'),
      endDate: new Date('2026-04-20T23:00:00Z'),
      isFeatured: false,
    },
    {
      title: 'Feria del Paste',
      description: 'Celebración del platillo típico con competencias y degustaciones.',
      location: 'Parque Central',
      startDate: new Date('2026-05-01T10:00:00Z'),
      endDate: new Date('2026-05-03T22:00:00Z'),
      isFeatured: true,
    },
    {
      title: 'Mercado Artesanal de Semana Santa',
      description: 'Expo-venta de artesanías tradicionales.',
      location: 'Plaza de la Constitución',
      startDate: new Date('2026-04-10T09:00:00Z'),
      endDate: new Date('2026-04-18T20:00:00Z'),
      isFeatured: false,
    },
    {
      title: 'Concierto en la Mina',
      description: 'Evento musical único dentro de la Mina de Acosta.',
      location: 'Mina de Acosta',
      startDate: new Date('2026-05-15T19:00:00Z'),
      endDate: new Date('2026-05-15T23:00:00Z'),
      isFeatured: true,
    },
    {
      title: 'Taller de Cocina Tradicional',
      description: 'Aprende a preparar platillos típicos con chefs locales.',
      location: 'Centro Cultural',
      startDate: new Date('2026-05-20T14:00:00Z'),
      endDate: new Date('2026-05-20T17:00:00Z'),
      isFeatured: false,
    },
    {
      title: 'Noche de Museos',
      description: 'Apertura especial de museos con entrada gratuita.',
      location: 'Varias ubicaciones',
      startDate: new Date('2026-05-25T18:00:00Z'),
      endDate: new Date('2026-05-25T22:00:00Z'),
      isFeatured: false,
    },
    {
      title: 'Carrera Atlética RDM',
      description: 'Carrera de montaña por los senderos locales.',
      location: 'Bosque de Pinos',
      startDate: new Date('2026-06-05T07:00:00Z'),
      endDate: new Date('2026-06-05T12:00:00Z'),
      isFeatured: false,
    },
    {
      title: 'Festival de la Nieve',
      description: 'Competencia de creación de nieve y degustaciones.',
      location: 'Parque Central',
      startDate: new Date('2026-06-20T11:00:00Z'),
      endDate: new Date('2026-06-20T18:00:00Z'),
      isFeatured: true,
    },
    {
      title: 'Noche de灯笼es',
      description: 'Iluminación tradicional china en el centro histórico.',
      location: 'Calles Coloniales',
      startDate: new Date('2026-07-01T19:00:00Z'),
      endDate: new Date('2026-07-01T23:00:00Z'),
      isFeatured: false,
    },
  ];

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    await prisma.event.upsert({
      where: { id: e.title.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        id: e.title.toLowerCase().replace(/ /g, '-'),
        title: e.title,
        description: e.description,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        isFeatured: e.isFeatured,
      },
    });
  }
  console.log('✅ Events created');

  // Create routes
  const routes = [
    {
      name: 'Ruta del Patrimonio',
      description: 'Caminata por los sitios históricos más importantes del pueblo.',
      difficulty: 'easy' as const,
      durationMinutes: 90,
      distanceKm: 2.5,
      isFamilyFriendly: true,
      points: [
        { order: 1, name: 'Plaza de la Constitución', lat: 20.1389, lng: -98.6750 },
        { order: 2, name: 'Parroquia de San Pedro', lat: 20.1383, lng: -98.6756 },
        { order: 3, name: 'Panteón Inglés', lat: 20.1397, lng: -98.6769 },
        { order: 4, name: 'Calles Coloniales', lat: 20.1392, lng: -98.6744 },
      ],
    },
    {
      name: 'Ruta del Café',
      description: 'Recorrido por los mejores cafés y casas de té del pueblo.',
      difficulty: 'easy' as const,
      durationMinutes: 60,
      distanceKm: 1.8,
      isFamilyFriendly: true,
      points: [
        { order: 1, name: 'Mina Coffee House', lat: 20.1391, lng: -98.6752 },
        { order: 2, name: 'Pastelería del Pueblo', lat: 20.1395, lng: -98.6760 },
        { order: 3, name: 'La Casa de los Tacos', lat: 20.1388, lng: -98.6748 },
      ],
    },
    {
      name: 'Ruta de los Miradores',
      description: 'Caminata hasta los mejores puntos panorámicos.',
      difficulty: 'medium' as const,
      durationMinutes: 120,
      distanceKm: 4.0,
      isFamilyFriendly: false,
      points: [
        { order: 1, name: 'Parque Central', lat: 20.1394, lng: -98.6756 },
        { order: 2, name: 'Vista del Peñón', lat: 20.1511, lng: -98.6694 },
        { order: 3, name: 'Mirador del Atardecer', lat: 20.1489, lng: -98.6711 },
      ],
    },
    {
      name: 'Ruta de la Historia',
      description: 'Recorrido guiado por la historia minera del pueblo.',
      difficulty: 'easy' as const,
      durationMinutes: 75,
      distanceKm: 2.0,
      isFamilyFriendly: true,
      points: [
        { order: 1, name: 'Mina de Acosta', lat: 20.1428, lng: -98.6833 },
        { order: 2, name: 'Plaza de la Constitución', lat: 20.1389, lng: -98.6750 },
        { order: 3, name: 'Panteón Inglés', lat: 20.1397, lng: -98.6769 },
      ],
    },
    {
      name: 'Ruta de Aventura',
      description: 'Ruta de senderismo por el bosque con obstáculos naturales.',
      difficulty: 'hard' as const,
      durationMinutes: 180,
      distanceKm: 8.5,
      isFamilyFriendly: false,
      isNightRoute: false,
      points: [
        { order: 1, name: 'Bosque de pinos', lat: 20.1556, lng: -98.6856 },
        { order: 2, name: 'Cascada oculta', lat: 20.1600, lng: -98.6900 },
        { order: 3, name: 'Mirador del Peñón', lat: 20.1650, lng: -98.6950 },
      ],
    },
    {
      name: 'Ruta Nocturna Mágica',
      description: 'Caminata nocturna iluminada con historias de fantasma.',
      difficulty: 'easy' as const,
      durationMinutes: 90,
      distanceKm: 2.2,
      isFamilyFriendly: false,
      isNightRoute: true,
      points: [
        { order: 1, name: 'Plaza de la Constitución', lat: 20.1389, lng: -98.6750 },
        { order: 2, name: 'Calles Coloniales', lat: 20.1392, lng: -98.6744 },
        { order: 3, name: 'Panteón Inglés', lat: 20.1397, lng: -98.6769 },
        { order: 4, name: 'Parroquia de San Pedro', lat: 20.1383, lng: -98.6756 },
      ],
    },
  ];

  for (let i = 0; i < routes.length; i++) {
    const r = routes[i];
    const route = await prisma.route.upsert({
      where: { id: r.name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: {
        id: r.name.toLowerCase().replace(/ /g, '-'),
        name: r.name,
        description: r.description,
        difficulty: r.difficulty,
        durationMinutes: r.durationMinutes,
        distanceKm: r.distanceKm,
        isFamilyFriendly: r.isFamilyFriendly,
        isNightRoute: r.isNightRoute || false,
        points: {
          create: r.points,
        },
      },
    });
  }
  console.log('✅ Routes created');

  // Create community posts
  const posts = [
    { placeName: 'Mina de Acosta', content: '¡Qué experiencia tan increíble! El tour por la mina fue impresionante. Los guías son muy profesionales y explican toda la historia. Totalmente recomendado para toda la familia.', userId: tourist.id },
    { placeName: 'Panteón Inglés', content: 'Visitando este lugar único en México. La arquitectura victoriana es fascinante y el ambiente es muy tranquilo.', userId: businessOwners[0]?.id || admin.id },
    { placeName: 'Vista del Peñón', content: 'La mejor vista del pueblo. Vine al atardecer y fue mágico ver cómo se ilumina Real del Monte.', userId: tourist.id },
    { placeName: 'Mina Coffee House', content: 'El mejor café de la región. Probé el espresso y estaba perfecto. El ambiente colonial es encantador.', userId: businessOwners[1]?.id || admin.id },
    { placeName: 'Plaza de la Constitución', content: 'Me encanta venir a caminar por el centro. Siempre hay algo nuevo que descubrir.', userId: tourist.id },
    { placeName: 'Festival Cultural', content: 'Asistí al festival y fue increíble. La música, la comida, todo perfecto. Ya quiero volver.', userId: tourist.id },
    { placeName: 'Calles Coloniales', content: 'Caminar por estas calles es como viajar en el tiempo. Los edificios coloniales están hermosamente conservados.', userId: businessOwners[2]?.id || admin.id },
    { placeName: 'Ruta del Patrimonio', content: 'Completamos la ruta hoy. Fue muy divertida y aprendimos mucho sobre la historia del pueblo.', userId: tourist.id },
    { placeName: 'La Casa de los Tacos', content: 'Los tacos de carnitas son los mejores que he probado. Y el precio es muy accesible.', userId: tourist.id },
    { placeName: 'Parroquia de San Pedro', content: 'La iglesia es hermosa por dentro. Los vitrales son impresionantes.', userId: tourist.id },
    { placeName: 'Mercado Artesanal', content: 'Encontré recuerdos hermosos. Los artesanos son muy amables y explican sus técnicas.', userId: tourist.id },
    { placeName: 'Hotel Real del Monte', content: 'Nos hospedamos aquí por una noche y fue perfecta la experiencia. La vista desde la habitación es increíble.', userId: tourist.id },
    { placeName: 'Mirador del Atardecer', content: 'El mejor lugar para ver el atardecer en todo el Valle del Mezquital.', userId: tourist.id },
    { placeName: 'Bosque de pinos', content: 'Hicimos senderismo por la mañana. El aire fresco y los sonidos de la naturaleza son perfectos para desconectarse.', userId: tourist.id },
    { placeName: 'Noche de Rutas', content: 'Experiencia sobrenatural. Las historias que cuentan los guías dan miedo pero divierten mucho.', userId: tourist.id },
    { placeName: 'Pastelería del Pueblo', content: 'Los dulces tradicionales son deliciosos. Me llevé varios para mi familia.', userId: tourist.id },
    { placeName: 'Galería de Arte local', content: 'Hay artistas muy talentosos. Compré una pintura que me encantó.', userId: businessOwners[0]?.id || admin.id },
    { placeName: 'Restaurante Los Portales', content: 'Comí mole poblano y estaba exquisito. El servicio es excelente.', userId: tourist.id },
    { placeName: 'Bar El Portal', content: 'La música en vivo el sábado pasado fue excelente. Muy buen ambiente.', userId: tourist.id },
    { placeName: 'Eco Aventuras RDM', content: 'Hicimos rappelling y fue una adrenalina pura. Los guías son profesionales y cuidan mucho la seguridad.', userId: tourist.id },
  ];

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    await prisma.post.create({
      data: {
        placeName: p.placeName,
        content: p.content,
        userId: p.userId,
        isModerated: true,
      },
    });
  }
  console.log('✅ Community posts created');

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
