create extension if not exists pgcrypto;

create or replace function public.normalize_person_name(value text)
returns text
language sql
immutable
as $$
  select lower(regexp_replace(trim(coalesce(value, '')), '\s+', ' ', 'g'));
$$;

create table if not exists public.personal_notes (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  slug text not null,
  content jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_name_norm text generated always as (public.normalize_person_name(first_name)) stored,
  last_name_norm text generated always as (public.normalize_person_name(last_name)) stored,
  constraint personal_notes_first_name_not_blank check (length(trim(first_name)) > 0),
  constraint personal_notes_last_name_not_blank check (length(trim(last_name)) > 0),
  constraint personal_notes_slug_not_blank check (length(trim(slug)) > 0),
  constraint personal_notes_slug_unique unique (slug),
  constraint personal_notes_recipient_unique unique (first_name_norm, last_name_norm)
);

create index if not exists personal_notes_published_lookup_idx
  on public.personal_notes (first_name_norm, last_name_norm)
  where published = true;

create index if not exists personal_notes_published_slug_idx
  on public.personal_notes (slug)
  where published = true;

create index if not exists personal_notes_updated_at_idx
  on public.personal_notes (updated_at desc);

create or replace function public.set_personal_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists personal_notes_set_updated_at on public.personal_notes;

create trigger personal_notes_set_updated_at
before update on public.personal_notes
for each row
execute function public.set_personal_notes_updated_at();

alter table public.personal_notes enable row level security;

revoke all on table public.personal_notes from anon, authenticated;
grant select, insert, update, delete on table public.personal_notes to service_role;
