-- Run once in Supabase SQL Editor. Every row is isolated by auth.uid().
create table if not exists public.chats (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text not null default 'Новый чат', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.messages (id uuid primary key default gen_random_uuid(), chat_id uuid not null references public.chats(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, role text not null check (role in ('user', 'assistant', 'system')), content text not null, created_at timestamptz not null default now());
create index if not exists chats_user_updated_idx on public.chats (user_id, updated_at desc);
create index if not exists messages_chat_created_idx on public.messages (chat_id, created_at);
alter table public.chats enable row level security;
alter table public.messages enable row level security;
create policy "Users manage own chats" on public.chats for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage own messages" on public.messages for all using (user_id = auth.uid() and exists (select 1 from public.chats where chats.id = messages.chat_id and chats.user_id = auth.uid())) with check (user_id = auth.uid() and exists (select 1 from public.chats where chats.id = messages.chat_id and chats.user_id = auth.uid()));
