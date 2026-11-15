create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  note_id uuid references public.personal_notes (id) on delete cascade,
  body text not null,
  display_name text,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now(),
  constraint comments_body_not_blank check (length(trim(body)) > 0)
);

create index if not exists comments_note_id_created_at_idx
  on public.comments (note_id, created_at desc);

create index if not exists comments_home_created_at_idx
  on public.comments (created_at desc)
  where note_id is null;

alter table public.comments enable row level security;

revoke all on table public.comments from anon, authenticated;
grant select, insert, update, delete on table public.comments to service_role;