create table if not exists public.site_visitors (
  visitor_key text primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create index if not exists site_visitors_last_seen_idx
  on public.site_visitors (last_seen desc);

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  signature text not null default '',
  body text not null default '',
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now(),
  constraint guestbook_signature_or_anonymous check (
    is_anonymous = true or length(trim(signature)) > 0
  )
);

create index if not exists guestbook_entries_created_at_idx
  on public.guestbook_entries (created_at desc);

create table if not exists public.ama_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  display_name text,
  is_anonymous boolean not null default false,
  contact_email text,
  contact_phone text,
  contact_handle text,
  created_at timestamptz not null default now(),
  constraint ama_question_not_blank check (length(trim(question)) > 0),
  constraint ama_one_contact check (
    length(trim(coalesce(contact_email, ''))) > 0
    or length(trim(coalesce(contact_phone, ''))) > 0
    or length(trim(coalesce(contact_handle, ''))) > 0
  )
);

create index if not exists ama_questions_created_at_idx
  on public.ama_questions (created_at desc);

alter table public.site_visitors enable row level security;
alter table public.guestbook_entries enable row level security;
alter table public.ama_questions enable row level security;

revoke all on table public.site_visitors from anon, authenticated;
revoke all on table public.guestbook_entries from anon, authenticated;
revoke all on table public.ama_questions from anon, authenticated;

grant select, insert, update, delete on table public.site_visitors to service_role;
grant select, insert, update, delete on table public.guestbook_entries to service_role;
grant select, insert, update, delete on table public.ama_questions to service_role;