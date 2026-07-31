-- Run after supabase-profiles-migration.sql in Supabase SQL Editor.
alter table public.profiles alter column first_name drop not null;
alter table public.profiles alter column age drop not null;
alter table public.profiles add column if not exists profile_completed boolean not null default false;
update public.profiles set profile_completed = (first_name is not null and age is not null) where profile_completed = false;

create or replace function public.create_profile_for_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare full_name text := coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '');
begin
  insert into public.profiles (user_id, first_name, last_name, avatar_url, profile_completed)
  values (
    new.id,
    nullif(split_part(trim(full_name), ' ', 1), ''),
    nullif(trim(regexp_replace(trim(full_name), '^\S+\s*', '')), ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    false
  ) on conflict (user_id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users for each row execute procedure public.create_profile_for_auth_user();
