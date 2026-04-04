-- Music economy subsystem (SECS)

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  base_price integer not null check (base_price >= 0),
  audio_url text,
  cover_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.song_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  song_id uuid not null references public.songs(id) on delete cascade,
  amount integer not null check (amount >= 0),
  stripe_session_id text unique,
  stripe_payment_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookpi_ledger (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  hash text not null,
  created_at timestamptz not null default now()
);

alter table public.songs enable row level security;
alter table public.song_purchases enable row level security;
alter table public.bookpi_ledger enable row level security;

create policy if not exists "Anyone can read active songs"
  on public.songs
  for select
  using (is_active = true);

create policy if not exists "Authenticated users can create own purchases"
  on public.song_purchases
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy if not exists "Users can read own purchases"
  on public.song_purchases
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy if not exists "Service role can insert bookpi"
  on public.bookpi_ledger
  for insert
  to service_role
  with check (true);

create index if not exists idx_song_purchases_song_id on public.song_purchases(song_id);
create index if not exists idx_song_purchases_user_id on public.song_purchases(user_id);
create index if not exists idx_bookpi_ledger_event_type on public.bookpi_ledger(event_type);
