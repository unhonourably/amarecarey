create extension if not exists pgcrypto with schema extensions;

create table if not exists public.admin_settings (
  id integer primary key default 1 check (id = 1),
  password_hash text not null,
  updated_at timestamptz not null default now()
);

alter table public.admin_settings enable row level security;

revoke all on table public.admin_settings from anon, authenticated;
grant select, insert, update, delete on table public.admin_settings to service_role;

create or replace function public.verify_admin_password(input_password text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  stored text;
begin
  if input_password is null or length(input_password) = 0 then
    return false;
  end if;

  select password_hash into stored
  from public.admin_settings
  where id = 1;

  if stored is null then
    return false;
  end if;

  return stored = extensions.crypt(input_password, stored);
end;
$$;

revoke all on function public.verify_admin_password(text) from public;
revoke all on function public.verify_admin_password(text) from anon, authenticated;
grant execute on function public.verify_admin_password(text) to service_role;

insert into public.admin_settings (id, password_hash)
values (1, extensions.crypt('CHANGE_ME_TO_YOUR_PASSWORD', extensions.gen_salt('bf')))
on conflict (id) do update
set
  password_hash = excluded.password_hash,
  updated_at = now();
