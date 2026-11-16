alter table public.guestbook_entries
  add column if not exists anonymous_number integer;

update public.guestbook_entries e
set anonymous_number = ranked.rn
from (
  select id, row_number() over (order by created_at asc) as rn
  from public.guestbook_entries
  where is_anonymous = true
) ranked
where e.id = ranked.id;