-- Stage 2 content schema (spec §5, §6, §8, §9.1, §10).
-- PostGIS geography on spots, bilingual MK/EN, photos metadata, favourites,
-- weather cache, admin roles, and the debounced rebuild row.
-- Free tier only: no image transforms, no content storage bucket.

create extension if not exists postgis with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.region as enum ('West', 'Central', 'East', 'Multi-Region');
create type public.difficulty as enum ('Easy', 'Moderate', 'Challenging');
create type public.publish_status as enum ('draft', 'published', 'archived');
create type public.translation_status as enum ('missing', 'machine', 'reviewed');
create type public.app_role as enum ('admin', 'editor');

-- ---------------------------------------------------------------------------
-- Roles. First admin is granted by the org owner in the dashboard (SETUP.md).
-- ---------------------------------------------------------------------------

create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

create policy "users read their own role"
on public.user_roles
for select
to authenticated
using (user_id = auth.uid());

revoke all on public.user_roles from anon, authenticated;
grant select on public.user_roles to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Spots and routes
-- ---------------------------------------------------------------------------

create table public.spots (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  region public.region not null check (region <> 'Multi-Region'),
  tags text[] not null default '{}',
  lat double precision not null check (lat between 40.8 and 42.4),
  lng double precision not null check (lng between 20.4 and 23.1),
  -- WGS84 point. lng/lat stay as the editable columns; this is derived.
  location extensions.geography(Point, 4326) generated always as (
    extensions.ST_SetSRID(extensions.ST_MakePoint(lng, lat), 4326)::extensions.geography
  ) stored,
  name_mk text,
  name_en text,
  description_mk text,
  description_en text,
  long_description_mk text,
  long_description_en text,
  tagline_mk text,
  tagline_en text,
  rider_tips_mk text[] not null default '{}',
  rider_tips_en text[] not null default '{}',
  status public.publish_status not null default 'draft',
  sort_order int not null default 0,
  mk_status public.translation_status not null default 'missing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  constraint spots_mk_required check (
    status <> 'published' or (
      mk_status = 'reviewed'
      and name_mk is not null
      and description_mk is not null
      and tagline_mk is not null
    )
  ),
  constraint spots_len check (
    char_length(coalesce(name_mk, '')) <= 120
    and char_length(coalesce(name_en, '')) <= 120
    and char_length(coalesce(description_mk, '')) <= 500
    and char_length(coalesce(description_en, '')) <= 500
    and char_length(coalesce(long_description_mk, '')) <= 5000
    and char_length(coalesce(long_description_en, '')) <= 5000
    and char_length(coalesce(tagline_mk, '')) <= 200
    and char_length(coalesce(tagline_en, '')) <= 200
  )
);

create index spots_tags_gin on public.spots using gin (tags);
create index spots_location_gix on public.spots using gist (location);
create index spots_status_idx on public.spots (status);

create table public.routes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,80}$'),
  region public.region not null,
  difficulty public.difficulty not null,
  distance_km numeric(6, 1),
  name_mk text,
  name_en text,
  description_mk text,
  description_en text,
  long_description_mk text,
  long_description_en text,
  tagline_mk text,
  tagline_en text,
  duration_mk text,
  duration_en text,
  highlights_mk text[] not null default '{}',
  highlights_en text[] not null default '{}',
  activities_mk text[] not null default '{}',
  activities_en text[] not null default '{}',
  rider_tips_mk text[] not null default '{}',
  rider_tips_en text[] not null default '{}',
  eat_and_rest jsonb not null default '[]' check (jsonb_typeof(eat_and_rest) = 'array'),
  details_mk jsonb not null default '{}' check (jsonb_typeof(details_mk) = 'object'),
  details_en jsonb not null default '{}' check (jsonb_typeof(details_en) = 'object'),
  cover_photo_id uuid,
  status public.publish_status not null default 'draft',
  sort_order int not null default 0,
  mk_status public.translation_status not null default 'missing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  constraint routes_mk_required check (
    status <> 'published' or (
      mk_status = 'reviewed'
      and name_mk is not null
      and description_mk is not null
      and duration_mk is not null
    )
  ),
  constraint routes_len check (
    char_length(coalesce(name_mk, '')) <= 120
    and char_length(coalesce(name_en, '')) <= 120
    and char_length(coalesce(description_mk, '')) <= 500
    and char_length(coalesce(description_en, '')) <= 500
    and char_length(coalesce(long_description_mk, '')) <= 5000
    and char_length(coalesce(long_description_en, '')) <= 5000
    and char_length(coalesce(tagline_mk, '')) <= 200
    and char_length(coalesce(tagline_en, '')) <= 200
    and char_length(coalesce(duration_mk, '')) <= 80
    and char_length(coalesce(duration_en, '')) <= 80
  )
);

create index routes_status_idx on public.routes (status);

create table public.route_spots (
  route_id uuid not null references public.routes (id) on delete cascade,
  spot_id uuid not null references public.spots (id) on delete restrict,
  position smallint not null check (position >= 0),
  things_to_do_mk text check (char_length(things_to_do_mk) <= 500),
  things_to_do_en text check (char_length(things_to_do_en) <= 500),
  primary key (route_id, spot_id),
  unique (route_id, position) deferrable initially deferred
);

create index route_spots_spot_id_idx on public.route_spots (spot_id);

-- A route cannot publish while any stop is unpublished.
-- A published spot cannot leave published while a published route uses it.
create or replace function public.check_route_stops_published()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_table_name = 'routes' and new.status = 'published' and exists (
    select 1
    from public.route_spots rs
    join public.spots s on s.id = rs.spot_id
    where rs.route_id = new.id
      and s.status <> 'published'
  ) then
    raise exception 'route % has unpublished stops', new.slug;
  elsif tg_table_name = 'spots'
    and tg_op = 'UPDATE'
    and old.status = 'published'
    and new.status <> 'published'
    and exists (
      select 1
      from public.route_spots rs
      join public.routes r on r.id = rs.route_id
      where rs.spot_id = new.id
        and r.status = 'published'
    ) then
    raise exception 'spot % is a stop on a published route', new.slug;
  end if;
  return new;
end;
$$;

create trigger routes_stops_guard
before insert or update of status on public.routes
for each row execute function public.check_route_stops_published();

create trigger spots_stops_guard
before update of status on public.spots
for each row execute function public.check_route_stops_published();

create or replace function public.touch_content()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

create trigger spots_touch
before insert or update on public.spots
for each row execute function public.touch_content();

create trigger routes_touch
before insert or update on public.routes
for each row execute function public.touch_content();

-- ---------------------------------------------------------------------------
-- Photo metadata. Files stay on the static host. No content bucket.
-- ---------------------------------------------------------------------------

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^(spots|routes)/[a-z0-9-]+/[0-9]{2}$'),
  width int not null check (width > 0),
  height int not null check (height > 0),
  alt_mk text not null check (char_length(alt_mk) between 3 and 250),
  alt_en text check (char_length(alt_en) <= 250),
  alt_mk_status public.translation_status not null default 'machine',
  is_own boolean not null default false,
  author text not null,
  license text not null,
  license_url text,
  source_url text,
  modified boolean not null default false,
  focal_x real not null default 0.5 check (focal_x between 0 and 1),
  focal_y real not null default 0.5 check (focal_y between 0 and 1),
  placeholder_color text check (placeholder_color ~ '^#[0-9a-fA-F]{6}$'),
  lqip text check (char_length(lqip) <= 2000),
  created_at timestamptz not null default now(),
  constraint photos_no_nc_nd check (license !~* '(NC|ND)'),
  constraint photos_credit check (
    is_own or (license_url is not null and source_url is not null)
  )
);

create table public.spot_photos (
  spot_id uuid not null references public.spots (id) on delete cascade,
  photo_id uuid not null references public.photos (id) on delete cascade,
  position smallint not null default 0,
  primary key (spot_id, photo_id),
  unique (spot_id, position)
);

alter table public.routes
  add constraint routes_cover_fk
  foreign key (cover_photo_id) references public.photos (id) on delete set null;

-- ---------------------------------------------------------------------------
-- RLS: public reads published content; admin writes.
-- ---------------------------------------------------------------------------

alter table public.spots enable row level security;
alter table public.routes enable row level security;
alter table public.route_spots enable row level security;
alter table public.photos enable row level security;
alter table public.spot_photos enable row level security;

create policy "published spots are public"
on public.spots
for select
to anon, authenticated
using (status = 'published' or public.is_admin());

create policy "admins insert spots"
on public.spots
for insert
to authenticated
with check (public.is_admin());

create policy "admins update spots"
on public.spots
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete spots"
on public.spots
for delete
to authenticated
using (public.is_admin());

create policy "published routes are public"
on public.routes
for select
to anon, authenticated
using (status = 'published' or public.is_admin());

create policy "admins insert routes"
on public.routes
for insert
to authenticated
with check (public.is_admin());

create policy "admins update routes"
on public.routes
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete routes"
on public.routes
for delete
to authenticated
using (public.is_admin());

create policy "stops of published routes are public"
on public.route_spots
for select
to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.routes r
    where r.id = route_id
      and r.status = 'published'
  )
);

create policy "admins insert route stops"
on public.route_spots
for insert
to authenticated
with check (public.is_admin());

create policy "admins update route stops"
on public.route_spots
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete route stops"
on public.route_spots
for delete
to authenticated
using (public.is_admin());

create policy "photos of published content are public"
on public.photos
for select
to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.spot_photos sp
    join public.spots s on s.id = sp.spot_id
    where sp.photo_id = photos.id
      and s.status = 'published'
  )
  or exists (
    select 1
    from public.routes r
    where r.cover_photo_id = photos.id
      and r.status = 'published'
  )
);

create policy "admins insert photos"
on public.photos
for insert
to authenticated
with check (public.is_admin());

create policy "admins update photos"
on public.photos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete photos"
on public.photos
for delete
to authenticated
using (public.is_admin());

create policy "spot photos of published spots are public"
on public.spot_photos
for select
to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.spots s
    where s.id = spot_id
      and s.status = 'published'
  )
);

create policy "admins insert spot photos"
on public.spot_photos
for insert
to authenticated
with check (public.is_admin());

create policy "admins update spot photos"
on public.spot_photos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins delete spot photos"
on public.spot_photos
for delete
to authenticated
using (public.is_admin());

revoke all on public.spots, public.routes, public.route_spots, public.photos, public.spot_photos
  from anon, authenticated;
grant select on public.spots, public.routes, public.route_spots, public.photos, public.spot_photos
  to anon, authenticated;
grant insert, update, delete on public.spots, public.routes, public.route_spots, public.photos, public.spot_photos
  to authenticated;

-- Ordered stops in one transaction. Deferred unique lets positions be rewritten.
create or replace function public.set_route_spots(
  p_route_id uuid,
  p_spot_slugs text[],
  p_things jsonb default '{}'::jsonb
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  i int;
  slug text;
  sid uuid;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;
  if p_spot_slugs is null then
    raise exception 'spot slugs required';
  end if;
  delete from public.route_spots where route_id = p_route_id;
  for i in 1 .. coalesce(cardinality(p_spot_slugs), 0) loop
    slug := p_spot_slugs[i];
    select id into sid from public.spots where spots.slug = slug;
    if sid is null then
      raise exception 'unknown spot %', slug;
    end if;
    insert into public.route_spots (
      route_id, spot_id, position, things_to_do_mk, things_to_do_en
    ) values (
      p_route_id,
      sid,
      (i - 1)::smallint,
      p_things -> slug ->> 'mk',
      p_things -> slug ->> 'en'
    );
  end loop;
end;
$$;

revoke all on function public.set_route_spots(uuid, text[], jsonb) from public;
grant execute on function public.set_route_spots(uuid, text[], jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Favourites (spec §8.1)
-- ---------------------------------------------------------------------------

create table public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  spot_id uuid references public.spots (id) on delete cascade,
  route_id uuid references public.routes (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (num_nonnulls(spot_id, route_id) = 1)
);

create unique index favorites_user_spot
  on public.favorites (user_id, spot_id)
  where spot_id is not null;

create unique index favorites_user_route
  on public.favorites (user_id, route_id)
  where route_id is not null;

alter table public.favorites enable row level security;

create policy fav_sel on public.favorites
for select to authenticated
using (user_id = auth.uid());

create policy fav_ins on public.favorites
for insert to authenticated
with check (user_id = auth.uid());

create policy fav_del on public.favorites
for delete to authenticated
using (user_id = auth.uid());

revoke all on public.favorites from anon, authenticated;
grant select, insert, delete on public.favorites to authenticated;

create or replace function public.merge_favorites(spot_slugs text[], route_slugs text[])
returns int
language sql
security invoker
set search_path = public
as $$
  with s as (
    insert into public.favorites (user_id, spot_id)
    select auth.uid(), id
    from public.spots
    where slug = any (spot_slugs[1:500])
    on conflict do nothing
    returning 1
  ),
  r as (
    insert into public.favorites (user_id, route_id)
    select auth.uid(), id
    from public.routes
    where slug = any (route_slugs[1:500])
    on conflict do nothing
    returning 1
  )
  select (select count(*) from s) + (select count(*) from r);
$$;

revoke all on function public.merge_favorites(text[], text[]) from public;
grant execute on function public.merge_favorites(text[], text[]) to authenticated;

-- ---------------------------------------------------------------------------
-- Weather cache and rate limits (spec §8.2). Clients read the table.
-- Writes are service-role only.
-- ---------------------------------------------------------------------------

create table public.weather_cache (
  spot_id uuid primary key references public.spots (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now(),
  stale boolean not null default false
);

alter table public.weather_cache enable row level security;

create policy weather_sel on public.weather_cache
for select
to anon, authenticated
using (true);

revoke all on public.weather_cache from anon, authenticated;
grant select on public.weather_cache to anon, authenticated;

create table public.rate_limits (
  bucket text not null,
  window_start timestamptz not null,
  count int not null default 0 check (count >= 0),
  primary key (bucket, window_start)
);

alter table public.rate_limits enable row level security;

revoke all on public.rate_limits from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Ops tables. No client writes. Admins may read.
-- ---------------------------------------------------------------------------

create table public.function_errors (
  id bigint generated always as identity primary key,
  source text not null,
  detail text not null check (char_length(detail) <= 2000),
  created_at timestamptz not null default now()
);

create table public.maintenance_log (
  id bigint generated always as identity primary key,
  job text not null,
  rows_affected int,
  detail text check (detail is null or char_length(detail) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.function_errors enable row level security;
alter table public.maintenance_log enable row level security;

create policy "admins read function errors"
on public.function_errors
for select
to authenticated
using (public.is_admin());

create policy "admins read maintenance log"
on public.maintenance_log
for select
to authenticated
using (public.is_admin());

revoke all on public.function_errors, public.maintenance_log from anon, authenticated;
grant select on public.function_errors, public.maintenance_log to authenticated;

-- ---------------------------------------------------------------------------
-- Debounced content rebuild (spec §9.1). The trigger does no HTTP.
-- ---------------------------------------------------------------------------

create table public.content_rebuild (
  id smallint primary key default 1 check (id = 1),
  dirty_since timestamptz,
  last_edit timestamptz,
  last_dispatch timestamptz,
  dispatches_today int not null default 0 check (dispatches_today >= 0),
  dispatches_day date
);

insert into public.content_rebuild (id) values (1);

alter table public.content_rebuild enable row level security;

create policy "admins read rebuild state"
on public.content_rebuild
for select
to authenticated
using (public.is_admin());

revoke all on public.content_rebuild from anon, authenticated;
grant select on public.content_rebuild to authenticated;

create or replace function public.mark_content_dirty()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.content_rebuild
  set dirty_since = coalesce(dirty_since, now()),
      last_edit = now()
  where id = 1;
  return null;
end;
$$;

revoke all on function public.mark_content_dirty() from public;

create trigger spots_dirty
after insert or update or delete on public.spots
for each statement execute function public.mark_content_dirty();

create trigger routes_dirty
after insert or update or delete on public.routes
for each statement execute function public.mark_content_dirty();

create trigger route_spots_dirty
after insert or update or delete on public.route_spots
for each statement execute function public.mark_content_dirty();

create trigger photos_dirty
after insert or update or delete on public.photos
for each statement execute function public.mark_content_dirty();

create trigger spot_photos_dirty
after insert or update or delete on public.spot_photos
for each statement execute function public.mark_content_dirty();

-- Reads the GitHub token or a later deploy-hook URL from Vault.
-- Not granted to anon or authenticated. pg_cron calls it (see retention migration).
create or replace function public.dispatch_rebuild()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.content_rebuild%rowtype;
  token text;
  hook_url text;
  today date := (timezone('utc', now()))::date;
  req_id bigint;
begin
  select * into rec from public.content_rebuild where id = 1 for update;
  if not found then
    return;
  end if;

  if rec.dispatches_day is distinct from today then
    update public.content_rebuild
    set dispatches_today = 0,
        dispatches_day = today
    where id = 1;
    rec.dispatches_today := 0;
  end if;

  if rec.dirty_since is null then
    return;
  end if;
  if rec.last_edit is not null and rec.last_edit > now() - interval '3 minutes' then
    return;
  end if;
  if rec.last_dispatch is not null and rec.last_dispatch > now() - interval '10 minutes' then
    return;
  end if;
  if rec.dispatches_today >= 20 then
    return;
  end if;

  begin
    select decrypted_secret into token
    from vault.decrypted_secrets
    where name = 'github_dispatch_token'
    limit 1;
    select decrypted_secret into hook_url
    from vault.decrypted_secrets
    where name = 'rebuild_dispatch_url'
    limit 1;
  exception
    when undefined_table or invalid_schema_name then
      token := null;
      hook_url := null;
  end;

  if coalesce(token, '') = '' and coalesce(hook_url, '') = '' then
    insert into public.function_errors (source, detail)
    values (
      'dispatch_rebuild',
      'vault secret github_dispatch_token or rebuild_dispatch_url is not set'
    );
    return;
  end if;

  if coalesce(hook_url, '') <> '' then
    req_id := net.http_post(
      url := hook_url,
      body := '{}'::jsonb,
      headers := jsonb_build_object('content-type', 'application/json')
    );
  else
    req_id := net.http_post(
      url := 'https://api.github.com/repos/realggzz88-tech/soulridemk/dispatches',
      body := jsonb_build_object('event_type', 'content-changed'),
      headers := jsonb_build_object(
        'content-type', 'application/json',
        'authorization', 'Bearer ' || token,
        'accept', 'application/vnd.github+json',
        'user-agent', 'soulride-dispatch'
      )
    );
  end if;

  update public.content_rebuild
  set dirty_since = null,
      last_dispatch = now(),
      dispatches_today = dispatches_today + 1,
      dispatches_day = today
  where id = 1;

  insert into public.maintenance_log (job, rows_affected, detail)
  values ('dispatch_rebuild', 1, 'queued net request ' || req_id::text);
exception
  when others then
    insert into public.function_errors (source, detail)
    values ('dispatch_rebuild', left(sqlerrm, 2000));
end;
$$;

revoke all on function public.dispatch_rebuild() from public, anon, authenticated;

-- Moderation deletes (spec §10). Owners keep their existing delete policies.
create policy "admins can delete messages"
on public.messages
for delete
to authenticated
using (public.is_admin());

create policy "admins can delete user routes"
on public.user_routes
for delete
to authenticated
using (public.is_admin());

grant all on public.spots, public.routes, public.route_spots, public.photos, public.spot_photos,
  public.favorites, public.weather_cache, public.rate_limits, public.function_errors,
  public.maintenance_log, public.content_rebuild, public.user_roles
  to service_role;
