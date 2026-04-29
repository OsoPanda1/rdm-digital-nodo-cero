-- =====================================================================
-- RDM DIGITAL — Seed inicial: Nodo Cero, 7 federaciones, territorio,
-- manuscrito y repositorios canónicos OsoPanda1
-- =====================================================================

-- 7 FEDERACIONES
insert into public.federations (id, name, motto, description, color_hex, icon, domain, modules) values
  ('educativa', 'Federación Educativa TAMV', 'El conocimiento como soberanía',
   'Universidad Soberana de Real del Monte. Currículo descolonizado, pedagogía minera, formación bilingüe español-otomí.',
   '#c47d3b', 'graduation-cap', 'edu.rdm.tamv',
   '["Universidad Soberana","Currículo Descolonizado","Pedagogía Minera","Bilingüe Otomí-Español"]'::jsonb),

  ('cultural', 'Federación Cultural TAMV', 'Memoria que no se extrae',
   'Custodia del patrimonio cornish-mexicano, festivales, archivo oral, lenguas originarias y la memoria del temporal.',
   '#8a6d4f', 'landmark', 'cul.rdm.tamv',
   '["Archivo Patrimonial","Festival del Paste","Lenguas Originarias","Memoria Temporal"]'::jsonb),

  ('economica', 'Federación Económica TAMV', 'Riqueza local, circulación local',
   'Crédito TAMV, comercio federado, comunalidad cooperativa, redistribución soberana, anti-extractivismo.',
   '#a87844', 'coins', 'eco.rdm.tamv',
   '["Crédito TAMV","Comercios Federados","Cooperativas","Redistribución"]'::jsonb),

  ('tecnologica', 'Federación Tecnológica TAMV', 'Código que no coloniza',
   'Kernel TAMV, Isabella Sentinel, soberanía algorítmica, infraestructura propia, edge computing minero.',
   '#6b8aa0', 'cpu', 'tec.rdm.tamv',
   '["Kernel TAMV","Isabella Sentinel","FANN","Eros AI","Infra Soberana"]'::jsonb),

  ('salud', 'Federación de Salud TAMV', 'Cuerpo territorio, territorio cuerpo',
   'Medicina mestiza cornish-otomí, herbolaria, salud mental comunitaria, telesalud federada.',
   '#7d9b7a', 'heart-pulse', 'sal.rdm.tamv',
   '["Herbolaria Otomí","Medicina Mestiza","Salud Mental","Telesalud Federada"]'::jsonb),

  ('comunicacion', 'Federación de Comunicación TAMV', 'La narrativa propia',
   'Radio del Monte, prensa soberana, contranarrativa, blog Tamvonline Network, broadcast ritual.',
   '#9b6b4a', 'radio', 'com.rdm.tamv',
   '["Radio del Monte","Prensa Soberana","Tamvonline Network","Broadcast Ritual"]'::jsonb),

  ('gubernamental', 'Federación Gubernamental TAMV', 'Asamblea, no representación',
   'Consejo del Nodo Cero, jurisprudencia ritual, asambleas federadas, registro civil soberano.',
   '#5e5048', 'scale', 'gob.rdm.tamv',
   '["Consejo Nodo Cero","Jurisprudencia Ritual","Asambleas","Registro Civil"]'::jsonb)
on conflict (id) do update set
  motto = excluded.motto, description = excluded.description, modules = excluded.modules;

-- TERRITORIO — POIs canónicos
insert into public.territory_pois (name, category, municipality, lat, lng, altitude_m, description, significance, federation_id) values
  ('Real del Monte (Centro Histórico)', 'historico', 'Real del Monte', 20.1432, -98.6694, 2700,
   'Cabecera del Nodo Cero. Templo principal del territorio TAMV.',
   'Coordenada de fundación de la República Digital. Origen del manuscrito.', 'gubernamental'),

  ('Mina de Acosta', 'mineria', 'Real del Monte', 20.1421, -98.6712, 2680,
   'Mina cornish del siglo XIX. Eje patrimonial del temporal extractivo.',
   'Memoria del trabajo cornish-mexicano. Símbolo de la herida y la resiliencia.', 'cultural'),

  ('Panteón Inglés', 'historico', 'Real del Monte', 20.1455, -98.6678, 2710,
   'Cementerio cornish del siglo XIX, único en su tipo en México.',
   'Sincretismo cornish-otomí-mexicano. Federación Cultural.', 'cultural'),

  ('Pachuca (Reloj Monumental)', 'historico', 'Pachuca', 20.1234, -98.7333, 2400,
   'Capital político-administrativa del Estado de Hidalgo.',
   'Nodo de articulación con el Estado Federal. Sede de relaciones formales.', 'gubernamental'),

  ('Mineral del Chico', 'geologico', 'Mineral del Chico', 20.2167, -98.7333, 2400,
   'Pueblo Mágico, bosque de oyameles, parque nacional.',
   'Federación de Salud y Cultural. Reserva ecocognitiva.', 'salud'),

  ('Plaza Principal Real del Monte', 'plaza', 'Real del Monte', 20.1428, -98.6691, 2700,
   'Asambleas federadas, festivales, mercado del paste.',
   'Sede física de la asamblea ciudadana del Nodo Cero.', 'gubernamental'),

  ('Mercado Soberano del Paste', 'mercado', 'Real del Monte', 20.1430, -98.6700, 2700,
   'Mercado federado de productores locales bajo el protocolo TAMV.',
   'Federación Económica. Punto de circulación de Crédito TAMV.', 'economica'),

  ('Templo del Kernel TAMV', 'templo', 'Real del Monte', 20.1438, -98.6685, 2705,
   'Espacio simbólico de la Federación Tecnológica. Servidor ritual.',
   'Núcleo cognitivo. Isabella Sentinel residencia simbólica.', 'tecnologica'),

  ('Universidad Soberana', 'escuela', 'Real del Monte', 20.1445, -98.6705, 2710,
   'Sede educativa del territorio. Pedagogía descolonizada.',
   'Federación Educativa. Formación de ciudadanos del Nodo Cero.', 'educativa'),

  ('Archivo Oral Otomí-Cornish', 'historico', 'Real del Monte', 20.1440, -98.6695, 2700,
   'Repositorio físico-digital de testimonios y lenguas originarias.',
   'Federación Cultural. Custodia de la memoria temporal.', 'cultural')
on conflict do nothing;

-- MANUSCRITO — Tomos del Compendio
insert into public.manuscripts (id, tomo_number, title, subtitle, description, status) values
  ('tomo-i-genesis', 1, 'Tomo I — Génesis',
   'Origen del Nodo Cero y declaración del Arquitecto',
   'Fundamento ontológico, ritual e institucional de la República Digital de Real del Monte. Principio de unicidad: Edwin Oswaldo Castillo Trejo / Anubis Villaseñor como creador único.',
   'published'),

  ('tomo-ii-kernel', 2, 'Tomo II — Kernel TAMV',
   'Núcleo cognitivo y soberanía algorítmica',
   'Arquitectura del Kernel TAMV: Isabella Sentinel v9.0, FANN, Eros AI, módulos guardianes. Soberanía sobre la inteligencia.',
   'published'),

  ('tomo-iii-territorio', 3, 'Tomo III — Territorio',
   'Real del Monte, Pachuca y Mineral del Chico como cuerpo geográfico',
   'Geografía sagrada y operativa. POIs federados, infraestructura territorial, memoria minera cornish-otomí.',
   'in_progress'),

  ('tomo-iv-geopolitica', 4, 'Tomo IV — Geopolítica',
   'Hidalgo como Nodo Cero del Sur Global',
   'Articulación con BRICS+, multilateralismo soberano, anti-colonialismo digital. La República Digital como interlocutor de Estado.',
   'in_progress')
on conflict (id) do update set status = excluded.status, description = excluded.description;

-- REPOSITORIOS canónicos OsoPanda1 (sembrado base, luego se sincronizan en vivo)
insert into public.repositories (id, name, full_name, description, url, homepage, classification, federation_id, default_branch) values
  ('OsoPanda1/rdm-digital-nodo-cero', 'rdm-digital-nodo-cero', 'OsoPanda1/rdm-digital-nodo-cero',
   'República Digital de Real del Monte — Nodo Cero. Repositorio de estructuración ontológica.',
   'https://github.com/OsoPanda1/rdm-digital-nodo-cero', 'https://tamvonline-oficial.odoo.com',
   'kernel', 'tecnologica', 'main')
on conflict (id) do nothing;
