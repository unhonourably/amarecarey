alter table public.guestbook_entries
  add column if not exists is_anonymous boolean not null default false;

alter table public.guestbook_entries
  drop constraint if exists guestbook_signature_not_blank;

alter table public.guestbook_entries
  add constraint guestbook_signature_or_anonymous check (
    is_anonymous = true or length(trim(signature)) > 0
  );