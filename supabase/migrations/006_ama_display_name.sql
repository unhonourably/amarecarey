alter table public.ama_questions
  add column if not exists display_name text,
  add column if not exists is_anonymous boolean not null default false;