-- Run in Supabase SQL Editor after supabase-schema.sql.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(trim(first_name)) between 1 and 60),
  last_name text check (last_name is null or char_length(trim(last_name)) <= 60),
  age smallint not null check (age between 1 and 150),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users manage own profile" on public.profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
create policy "Users upload own avatars" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users update own avatars" on storage.objects for update to authenticated using (bucket_id = 'avatars' and owner_id = auth.uid()::text);
create policy "Users delete own avatars" on storage.objects for delete to authenticated using (bucket_id = 'avatars' and owner_id = auth.uid()::text);
