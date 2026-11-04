-- Local Postgres 17 no longer creates the storage schema before user migrations,
-- and stage 1 inserts into storage.buckets during database init (before the
-- storage API can migrate). This file is intentionally timestamped just before
-- that insert. On a hosted project, storage.buckets already exists and this
-- block does nothing.

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'storage'
      and table_name = 'buckets'
  ) then
    return;
  end if;

  create schema if not exists storage;

  create table storage.buckets (
    id text primary key,
    name text not null,
    owner uuid,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    public boolean default false,
    file_size_limit bigint,
    allowed_mime_types text[]
  );

  create unique index bname on storage.buckets (name);

  create table storage.objects (
    id uuid primary key default gen_random_uuid(),
    bucket_id text references storage.buckets (id),
    name text,
    owner uuid,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    last_accessed_at timestamptz default now(),
    metadata jsonb,
    owner_id text,
    unique (bucket_id, name)
  );

  alter table storage.objects enable row level security;

  create or replace function storage.foldername(name text)
  returns text[]
  language plpgsql
  immutable
  as $fn$
  declare
    parts text[];
  begin
    parts := string_to_array(name, '/');
    return parts[1:array_length(parts, 1) - 1];
  end
  $fn$;

  grant usage on schema storage to postgres, anon, authenticated, service_role;
  grant all on all tables in schema storage to postgres, anon, authenticated, service_role;
  grant execute on function storage.foldername(text) to postgres, anon, authenticated, service_role;
end
$$;
