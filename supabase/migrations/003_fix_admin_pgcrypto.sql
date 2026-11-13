create extension if not exists pgcrypto with schema extensions;

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
