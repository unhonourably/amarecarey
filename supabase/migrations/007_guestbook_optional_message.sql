alter table public.guestbook_entries
  drop constraint if exists guestbook_body_not_blank;