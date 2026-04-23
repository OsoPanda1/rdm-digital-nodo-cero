-- TAMV Knowledge Graph Core (PostgreSQL + pgvector)
-- Núcleo base: nodos, relaciones, documentos, fragmentos, fuentes, tags, versiones.

create extension if not exists vector;
create extension if not exists pgcrypto;

create table if not exists public.node_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_code text not null default 'TAMV',
  slug text unique not null,
  title text not null,
  doc_type text not null check (doc_type in ('README', 'manifiesto', 'blueprint', 'entrevista', 'nota', 'pdf')),
  content text not null,
  source_url text,
  author text,
  status text not null default 'raw' check (status in ('raw', 'processed', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.nodes (
  id uuid primary key default gen_random_uuid(),
  project_code text not null default 'TAMV',
  type_code text not null references public.node_types(code),
  slug text unique not null,
  title text not null,
  summary text,
  body text,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived', 'vision')),
  importance int not null default 50 check (importance between 0 and 100),
  source_doc_id uuid null references public.documents(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.edges (
  id uuid primary key default gen_random_uuid(),
  project_code text not null default 'TAMV',
  from_node_id uuid not null references public.nodes(id) on delete cascade,
  to_node_id uuid not null references public.nodes(id) on delete cascade,
  relation_type text not null check (
    relation_type in (
      'defines',
      'represents',
      'contains',
      'depends_on',
      'connected_to',
      'governs',
      'generates_value_for',
      'implemented_in',
      'evolves_into',
      'documents',
      'is_same_as',
      'implements',
      'embodies',
      'preserves'
    )
  ),
  strength numeric(3,2) not null default 1.0 check (strength >= 0 and strength <= 1),
  rationale text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (from_node_id, to_node_id, relation_type)
);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  node_id uuid null references public.nodes(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  project_code text not null default 'TAMV',
  source_type text not null check (source_type in ('pdf', 'url', 'note', 'audio', 'interview')),
  title text not null,
  locator text,
  reliability_score numeric(3,2) not null default 1.0 check (reliability_score >= 0 and reliability_score <= 1),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text not null
);

create table if not exists public.node_tags (
  node_id uuid not null references public.nodes(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (node_id, tag_id)
);

create table if not exists public.node_versions (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.nodes(id) on delete cascade,
  version_number int not null,
  title text not null,
  summary text,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  changed_by text not null default 'system',
  created_at timestamptz not null default now(),
  unique (node_id, version_number)
);

create index if not exists idx_nodes_project_type on public.nodes(project_code, type_code);
create index if not exists idx_nodes_status_importance on public.nodes(status, importance desc);
create index if not exists idx_edges_from_to on public.edges(from_node_id, to_node_id);
create index if not exists idx_edges_relation_type on public.edges(relation_type);
create index if not exists idx_document_chunks_document on public.document_chunks(document_id, chunk_index);
create index if not exists idx_sources_project_type on public.sources(project_code, source_type);
create index if not exists idx_nodes_metadata on public.nodes using gin(metadata);
create index if not exists idx_edges_metadata on public.edges using gin(metadata);
create index if not exists idx_nodes_embedding on public.nodes using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index if not exists idx_chunks_embedding on public.document_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_documents_updated_at on public.documents;
create trigger trg_documents_updated_at
before update on public.documents
for each row execute function public.touch_updated_at();

drop trigger if exists trg_nodes_updated_at on public.nodes;
create trigger trg_nodes_updated_at
before update on public.nodes
for each row execute function public.touch_updated_at();

insert into public.node_types (code, label, description) values
('identity', 'Identidad', 'Personas, roles, firmas, figuras simbólicas'),
('concept', 'Concepto', 'Ideas, principios, marcos y definiciones'),
('system', 'Sistema', 'Subsistemas y plataformas principales'),
('asset', 'Activo', 'NFT, producto, servicio o recurso'),
('process', 'Proceso', 'Secuencia operativa o flujo de trabajo'),
('protocol', 'Protocolo', 'Reglas, normas y procedimientos de seguridad'),
('territory', 'Territorio', 'Lugar físico, digital o nodal'),
('document', 'Documento', 'Fuente textual maestra o derivada'),
('event', 'Evento', 'Hito, lanzamiento, fecha o suceso'),
('model', 'Modelo', 'Estructura económica, técnica o de gobernanza')
on conflict (code) do nothing;

insert into public.nodes (type_code, slug, title, summary, status, importance, metadata) values
('system', 'tamv-core', 'TAMV Core', 'Núcleo cognitivo e institucional del ecosistema TAMV.', 'active', 100, '{"domain":"ecosystem","canonical":true}'),
('system', 'tamv-online-network', 'TAMV Online Network', 'Ecosistema digital y civilizatorio del proyecto TAMV.', 'active', 100, '{"domain":"network","canonical":true}'),
('identity', 'anubis-villasenor', 'Anubis Villaseñor', 'Figura simbólica y narrativa central del proyecto.', 'active', 95, '{"role":"Arquitecto Raíz","created_by":"human"}'),
('identity', 'edwin-oswaldo-castillo-trejo', 'Edwin Oswaldo Castillo Trejo', 'Nombre legal asociado al Arquitecto Raíz.', 'active', 90, '{"role":"Fundador","created_by":"human"}'),
('document', 'manifiesto-tamv', 'Manifiesto TAMV', 'Documento rector de visión, propósito y principios.', 'active', 100, '{"doc_kind":"manifesto"}'),
('model', 'md-x4', 'MD-X4', 'Arquitectura de 7 capas civilizatorias y técnicas.', 'active', 98, '{"layers":7}'),
('concept', 'territorio-autonomo-de-memoria-viva', 'Territorio Autónomo de Memoria Viva', 'Definición conceptual del TAMV.', 'active', 100, '{"type":"canonical_definition"}'),
('system', 'utamv', 'UTAMV', 'Universidad del ecosistema TAMV.', 'vision', 92, '{"domain":"education"}'),
('territory', 'rdm-digital', 'RDM Digital', 'Nodo territorial del proyecto en Real del Monte.', 'active', 95, '{"location":"Real del Monte, México"}'),
('system', 'isabella-ia', 'Isabella IA', 'Sistema de inteligencia ética y asistencia cognitiva.', 'active', 96, '{"role":"ethical_ai"}'),
('protocol', 'tenochtitlan-security', 'Sistema TENOCHTITLAN', 'Arquitectura de seguridad, vigilancia y antifraude.', 'active', 94, '{"domain":"security"}'),
('asset', 'nft-el-regalo-del-alma', 'NFT El Regalo del Alma', 'Colección o activo simbólico y económico del ecosistema.', 'vision', 85, '{"asset_type":"nft"}'),
('model', 'fairsplit', 'FairSplit', 'Modelo de distribución económica y monetización justa.', 'active', 90, '{"domain":"economics"}'),
('concept', 'soberania-digital', 'Soberanía Digital', 'Principio rector de control, autonomía y memoria.', 'active', 98, '{"category":"principle"}'),
('concept', 'memoria-historica', 'Memoria Histórica', 'Preservación y activación de identidad y territorio.', 'active', 97, '{"category":"cultural"}')
on conflict (slug) do nothing;

with n as (
  select slug, id from public.nodes
)
insert into public.edges (from_node_id, to_node_id, relation_type, strength, rationale, metadata)
select a.id, b.id, 'defines', 1.0, 'Nodo rector define al ecosistema', '{"review_status":"approved","confidence":1.0}'::jsonb
from n a, n b
where a.slug = 'manifiesto-tamv' and b.slug = 'tamv-core'
union all
select a.id, b.id, 'represents', 1.0, 'Figura simbólica central del proyecto', '{"review_status":"approved","confidence":1.0}'::jsonb
from n a, n b
where a.slug = 'anubis-villasenor' and b.slug = 'tamv-core'
union all
select a.id, b.id, 'is_same_as', 1.0, 'Nombre legal asociado al Arquitecto Raíz', '{"review_status":"approved","confidence":1.0}'::jsonb
from n a, n b
where a.slug = 'edwin-oswaldo-castillo-trejo' and b.slug = 'anubis-villasenor'
union all
select a.id, b.id, 'implements', 1.0, 'Arquitectura operativa del sistema', '{"review_status":"approved","confidence":0.95}'::jsonb
from n a, n b
where a.slug = 'md-x4' and b.slug = 'tamv-core'
union all
select a.id, b.id, 'contains', 1.0, 'UTAMV como subsistema', '{"review_status":"approved","confidence":0.95}'::jsonb
from n a, n b
where a.slug = 'tamv-core' and b.slug = 'utamv'
union all
select a.id, b.id, 'contains', 1.0, 'RDM Digital como nodo territorial', '{"review_status":"approved","confidence":0.95}'::jsonb
from n a, n b
where a.slug = 'tamv-core' and b.slug = 'rdm-digital'
union all
select a.id, b.id, 'contains', 1.0, 'Isabella IA como subsistema cognitivo', '{"review_status":"approved","confidence":0.95}'::jsonb
from n a, n b
where a.slug = 'tamv-core' and b.slug = 'isabella-ia'
union all
select a.id, b.id, 'depends_on', 0.9, 'Seguridad base del ecosistema', '{"review_status":"approved","confidence":0.9}'::jsonb
from n a, n b
where a.slug = 'tamv-core' and b.slug = 'tenochtitlan-security'
union all
select a.id, b.id, 'generates_value_for', 0.9, 'Modelo económico del ecosistema', '{"review_status":"approved","confidence":0.9}'::jsonb
from n a, n b
where a.slug = 'fairsplit' and b.slug = 'tamv-core'
union all
select a.id, b.id, 'embodies', 1.0, 'Principio rector de autonomía', '{"review_status":"approved","confidence":1.0}'::jsonb
from n a, n b
where a.slug = 'soberania-digital' and b.slug = 'tamv-core'
union all
select a.id, b.id, 'preserves', 1.0, 'Memoria como base del ecosistema', '{"review_status":"approved","confidence":1.0}'::jsonb
from n a, n b
where a.slug = 'memoria-historica' and b.slug = 'tamv-core'
union all
select a.id, b.id, 'generates_value_for', 0.8, 'Activo económico y simbólico', '{"review_status":"pending","confidence":0.8}'::jsonb
from n a, n b
where a.slug = 'nft-el-regalo-del-alma' and b.slug = 'tamv-core'
on conflict (from_node_id, to_node_id, relation_type) do nothing;
