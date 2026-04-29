-- =====================================================================
-- RDM DIGITAL — NODO CERO
-- Schema completo de la República Digital de Real del Monte
-- Soberano, federado, auditable. Constancia: EOCT.
-- =====================================================================

-- Extensión necesaria para hashing/uuid
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- =====================================================================
-- 1. PERFILES (extiende auth.users)
-- Roles: ciudadano | comercio | institucion | ia | gobierno | arquitecto
-- =====================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  full_name text,
  role text not null default 'ciudadano' check (role in ('ciudadano','comercio','institucion','ia','gobierno','arquitecto')),
  orcid text,
  avatar_url text,
  bio text,
  citizenship_id text unique,
  consent_citemesh boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles for select using (true);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- =====================================================================
-- 2. FEDERACIONES (las 7 hijas del Nodo Cero)
-- =====================================================================
create table if not exists public.federations (
  id text primary key,
  name text not null,
  motto text,
  description text,
  color_hex text,
  icon text,
  domain text,
  active boolean default true,
  modules jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.federations enable row level security;
drop policy if exists "federations_public_read" on public.federations;
create policy "federations_public_read" on public.federations for select using (true);

-- =====================================================================
-- 3. TERRITORIO — POIs georreferenciados
-- =====================================================================
create table if not exists public.territory_pois (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('mineria','templo','plaza','mercado','escuela','federacion','ritual','geologico','historico')),
  municipality text not null check (municipality in ('Real del Monte','Pachuca','Mineral del Chico','Singuilucan','Mineral de la Reforma')),
  lat double precision not null,
  lng double precision not null,
  altitude_m integer,
  description text,
  significance text,
  federation_id text references public.federations(id),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.territory_pois enable row level security;
drop policy if exists "pois_public_read" on public.territory_pois;
create policy "pois_public_read" on public.territory_pois for select using (true);

-- =====================================================================
-- 4. COMERCIOS LOCALES (onboarding federación económica)
-- =====================================================================
create table if not exists public.merchants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  business_name text not null,
  rfc text,
  category text,
  description text,
  municipality text,
  address text,
  lat double precision,
  lng double precision,
  cover_url text,
  stripe_account_id text,
  verified boolean default false,
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.merchants enable row level security;
drop policy if exists "merchants_public_read" on public.merchants;
create policy "merchants_public_read" on public.merchants for select using (active = true);
drop policy if exists "merchants_owner_write" on public.merchants;
create policy "merchants_owner_write" on public.merchants for all using (auth.uid() = owner_id);

-- =====================================================================
-- 5. PRODUCTOS / SERVICIOS soberanos
-- =====================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid references public.merchants(id) on delete cascade,
  name text not null,
  description text,
  price_cents integer not null,
  currency text default 'mxn',
  image_url text,
  active boolean default true,
  stock integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.products enable row level security;
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (active = true);
drop policy if exists "products_merchant_write" on public.products;
create policy "products_merchant_write" on public.products for all using (
  exists (select 1 from public.merchants m where m.id = merchant_id and m.owner_id = auth.uid())
);

-- =====================================================================
-- 6. WALLET CIUDADANO (créditos TAMV / pesos)
-- =====================================================================
create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance_mxn_cents bigint default 0,
  balance_tamv_credits bigint default 0,
  reputation integer default 100,
  updated_at timestamptz default now()
);

alter table public.wallets enable row level security;
drop policy if exists "wallets_owner_read" on public.wallets;
create policy "wallets_owner_read" on public.wallets for select using (auth.uid() = user_id);

-- =====================================================================
-- 7. TRANSACCIONES (auditoría inmutable de pagos Stripe)
-- =====================================================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  merchant_id uuid references public.merchants(id),
  product_id uuid references public.products(id),
  federation_id text references public.federations(id),
  stripe_session_id text unique,
  stripe_payment_intent text,
  amount_cents integer not null,
  currency text default 'mxn',
  status text default 'pending' check (status in ('pending','paid','failed','refunded')),
  type text default 'purchase' check (type in ('purchase','donation','tribute','tax','redistribution')),
  hash text, -- hash forense
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;
drop policy if exists "transactions_owner_read" on public.transactions;
create policy "transactions_owner_read" on public.transactions for select using (auth.uid() = user_id);

-- =====================================================================
-- 8. MANUSCRITO DIGITAL — Tomos / Capítulos / Citas
-- =====================================================================
create table if not exists public.manuscripts (
  id text primary key, -- ej: 'tomo-i-genesis'
  tomo_number integer not null,
  title text not null,
  subtitle text,
  description text,
  cover_url text,
  author text default 'Edwin Oswaldo Castillo Trejo',
  ritual_name text default 'Anubis Villaseñor',
  orcid text default '0009-0008-5050-1539',
  doi text,
  status text default 'in_progress' check (status in ('draft','in_progress','published','archived')),
  word_count integer default 0,
  published_at timestamptz,
  created_at timestamptz default now()
);

alter table public.manuscripts enable row level security;
drop policy if exists "manuscripts_public_read" on public.manuscripts;
create policy "manuscripts_public_read" on public.manuscripts for select using (true);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  manuscript_id text references public.manuscripts(id) on delete cascade,
  number integer not null,
  title text not null,
  excerpt text,
  body_md text,
  hash_sha256 text,
  word_count integer,
  created_at timestamptz default now()
);

alter table public.chapters enable row level security;
drop policy if exists "chapters_public_read" on public.chapters;
create policy "chapters_public_read" on public.chapters for select using (true);

-- =====================================================================
-- 9. CITEMESH — Protocolo anti-extractivo de citación
-- =====================================================================
create table if not exists public.citations (
  id uuid primary key default gen_random_uuid(),
  citing_entity text not null, -- e.g. "openai", "anthropic", "academic-paper-x"
  cited_artifact text not null, -- e.g. "tomo-i-genesis"
  citation_type text check (citation_type in ('verbatim','paraphrase','derivative','training_data','reference')),
  origin_url text,
  context text,
  consent_status text default 'pending' check (consent_status in ('pending','granted','denied','revoked','infringement')),
  detected_at timestamptz default now(),
  resolved_at timestamptz
);

alter table public.citations enable row level security;
drop policy if exists "citations_public_read" on public.citations;
create policy "citations_public_read" on public.citations for select using (true);

-- =====================================================================
-- 10. REPOSITORIO GITHUB OsoPanda1 — Cache de nodos evolutivos
-- =====================================================================
create table if not exists public.repositories (
  id text primary key, -- e.g. 'OsoPanda1/rdm-digital-nodo-cero'
  name text not null,
  full_name text not null,
  description text,
  url text not null,
  homepage text,
  language text,
  topics text[],
  stars integer default 0,
  forks integer default 0,
  size_kb integer default 0,
  default_branch text default 'main',
  is_archived boolean default false,
  is_fork boolean default false,
  federation_id text references public.federations(id),
  classification text, -- 'kernel','federation','manuscript','ritual','tool'
  pushed_at timestamptz,
  created_at_gh timestamptz,
  synced_at timestamptz default now()
);

alter table public.repositories enable row level security;
drop policy if exists "repos_public_read" on public.repositories;
create policy "repos_public_read" on public.repositories for select using (true);

-- =====================================================================
-- 11. EVENTOS DEL TERRITORIO (festivales, asambleas, rituales)
-- =====================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text check (category in ('asamblea','festival','ritual','academico','comercial','tecnologico')),
  federation_id text references public.federations(id),
  poi_id uuid references public.territory_pois(id),
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity integer,
  registered_count integer default 0,
  cover_url text,
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.events enable row level security;
drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events for select using (true);

-- =====================================================================
-- 12. AUDITORÍA SOBERANA (log inmutable EOCT)
-- =====================================================================
create table if not exists public.audit_log (
  id bigserial primary key,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id text,
  payload jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

alter table public.audit_log enable row level security;
drop policy if exists "audit_arquitecto_read" on public.audit_log;
create policy "audit_arquitecto_read" on public.audit_log for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('arquitecto','gobierno'))
);

-- =====================================================================
-- TRIGGER: auto-create profile + wallet on signup
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'ciudadano')
  )
  on conflict (id) do nothing;

  insert into public.wallets (user_id) values (new.id) on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
