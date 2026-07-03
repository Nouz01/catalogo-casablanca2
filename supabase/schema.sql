-- Catálogo digital Casablanca — esquema inicial
-- Ejecutar una sola vez en Supabase: Dashboard > SQL Editor > New query > pegar y correr.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null,
  price numeric(10, 2),
  detalles text,
  beneficios text,
  caracteristicas text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id int primary key default 1,
  brand_name text not null default 'Casablanca',
  whatsapp_number text,
  logo_path text,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

-- Row Level Security: lectura pública, escritura solo para usuarios logueados
-- (el panel admin usa un único usuario de Supabase Auth).

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.settings enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "authenticated write categories" on public.categories;
create policy "authenticated write categories" on public.categories
  for all to authenticated using (true) with check (true);

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select to anon, authenticated using (true);

drop policy if exists "authenticated write products" on public.products;
create policy "authenticated write products" on public.products
  for all to authenticated using (true) with check (true);

drop policy if exists "public read product_images" on public.product_images;
create policy "public read product_images" on public.product_images
  for select to anon, authenticated using (true);

drop policy if exists "authenticated write product_images" on public.product_images;
create policy "authenticated write product_images" on public.product_images
  for all to authenticated using (true) with check (true);

drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings
  for select to anon, authenticated using (true);

drop policy if exists "authenticated write settings" on public.settings;
create policy "authenticated write settings" on public.settings
  for all to authenticated using (true) with check (true);

-- Storage: bucket público para fotos de producto y para el logo de marca.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

drop policy if exists "public read product-images" on storage.objects;
create policy "public read product-images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');

drop policy if exists "authenticated write product-images" on storage.objects;
create policy "authenticated write product-images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists "authenticated update product-images" on storage.objects;
create policy "authenticated update product-images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

drop policy if exists "authenticated delete product-images" on storage.objects;
create policy "authenticated delete product-images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

drop policy if exists "public read branding" on storage.objects;
create policy "public read branding" on storage.objects
  for select to anon, authenticated using (bucket_id = 'branding');

drop policy if exists "authenticated write branding" on storage.objects;
create policy "authenticated write branding" on storage.objects
  for insert to authenticated with check (bucket_id = 'branding');

drop policy if exists "authenticated update branding" on storage.objects;
create policy "authenticated update branding" on storage.objects
  for update to authenticated using (bucket_id = 'branding');

drop policy if exists "authenticated delete branding" on storage.objects;
create policy "authenticated delete branding" on storage.objects
  for delete to authenticated using (bucket_id = 'branding');
