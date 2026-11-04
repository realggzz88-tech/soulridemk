-- Chat retention (12 months, D-Q5) and delete-account support.
-- Edge functions are scaffolds and are not deployed.
-- GDPR note for the privacy copy (not legal advice; ClickCash confirms the wording):
-- chat messages and chat photos are deleted 12 months after posting.
-- Encrypted backup artifacts may keep them for up to 30 days.
-- Account deletion removes the auth user; user tables cascade.

create index if not exists messages_created_at_idx on public.messages (created_at);

create or replace function public.purge_old_chat_messages()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
  total int := 0;
begin
  loop
    delete from public.messages
    where id in (
      select id
      from public.messages
      where created_at < now() - interval '12 months'
      limit 5000
    );
    get diagnostics n = row_count;
    total := total + n;
    exit when n = 0;
  end loop;

  insert into public.maintenance_log (job, rows_affected, detail)
  values ('purge-chat-messages', total, 'messages older than 12 months');
  return total;
end;
$$;

revoke all on function public.purge_old_chat_messages() from public, anon, authenticated;

-- Names only. The purge-chat-photos function deletes the files through the Storage API.
create or replace function public.chat_photo_names_older_than(
  cutoff timestamptz,
  lim int default 1000
)
returns text[]
language sql
security definer
set search_path = storage, public
as $$
  select coalesce(array_agg(name order by name), '{}'::text[])
  from (
    select name
    from storage.objects
    where bucket_id = 'chat-photos'
      and created_at < cutoff
    order by created_at
    limit least(greatest(lim, 0), 1000)
  ) older;
$$;

revoke all on function public.chat_photo_names_older_than(timestamptz, int) from public, anon, authenticated;
grant execute on function public.chat_photo_names_older_than(timestamptz, int) to service_role;

-- Folders the delete-account function removes before auth.admin.deleteUser.
create or replace function public.user_upload_paths(p_user_id uuid)
returns table (bucket_id text, name text)
language sql
security definer
set search_path = storage, public
as $$
  select o.bucket_id, o.name
  from storage.objects o
  where o.bucket_id in ('avatars', 'rides', 'route-photos', 'chat-photos')
    and (storage.foldername(o.name))[1] = p_user_id::text;
$$;

revoke all on function public.user_upload_paths(uuid) from public, anon, authenticated;
grant execute on function public.user_upload_paths(uuid) to service_role;

-- Hourly: rate-limit rows older than 1 hour, ops logs older than 30 days,
-- and stale weather rows older than 48 hours. Current weather rows stay so
-- clients can keep reading the cache.
create or replace function public.purge_ephemeral_rows()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rates int;
  errors int;
  logs int;
  weather int;
begin
  delete from public.rate_limits
  where window_start < now() - interval '1 hour';
  get diagnostics rates = row_count;

  delete from public.weather_cache
  where stale
    and fetched_at < now() - interval '48 hours';
  get diagnostics weather = row_count;

  delete from public.function_errors
  where created_at < now() - interval '30 days';
  get diagnostics errors = row_count;

  delete from public.maintenance_log
  where created_at < now() - interval '30 days'
    and job <> 'purge-ephemeral';
  get diagnostics logs = row_count;

  insert into public.maintenance_log (job, rows_affected, detail)
  values (
    'purge-ephemeral',
    rates + weather + errors + logs,
    'rate_limits=' || rates || ' stale_weather=' || weather
      || ' function_errors=' || errors || ' maintenance_log=' || logs
  );
end;
$$;

revoke all on function public.purge_ephemeral_rows() from public, anon, authenticated;

-- Every user-owned table that should disappear with the account cascades.
do $$
declare
  bad text;
begin
  select string_agg(rel.relname || '.' || a.attname, ', ')
  into bad
  from pg_constraint c
  join pg_class rel on rel.oid = c.conrelid
  join pg_namespace n on n.oid = rel.relnamespace
  join pg_class frel on frel.oid = c.confrelid
  join pg_namespace fn on fn.oid = frel.relnamespace
  join pg_attribute a on a.attrelid = rel.oid and a.attnum = any (c.conkey)
  where c.contype = 'f'
    and fn.nspname = 'auth'
    and frel.relname = 'users'
    and n.nspname = 'public'
    and rel.relname in (
      'profiles',
      'messages',
      'user_routes',
      'user_route_likes',
      'favorites',
      'user_roles'
    )
    and c.confdeltype <> 'c';

  if bad is not null then
    raise exception 'missing ON DELETE CASCADE to auth.users: %', bad;
  end if;
end;
$$;

-- pg_cron and pg_net are free-tier features. If the local image cannot load
-- them, the SQL functions above are still the retention implementation.
do $jobs$
begin
  begin
    create extension if not exists pg_cron with schema pg_catalog;
  exception
    when others then
      raise notice 'pg_cron not installed: %', sqlerrm;
  end;

  begin
    create extension if not exists pg_net with schema extensions;
  exception
    when others then
      raise notice 'pg_net not installed: %', sqlerrm;
  end;

  begin
    create extension if not exists supabase_vault;
  exception
    when others then
      raise notice 'supabase_vault not installed: %', sqlerrm;
  end;

  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    if exists (select 1 from cron.job where jobname = 'purge-chat-messages') then
      perform cron.unschedule('purge-chat-messages');
    end if;
    perform cron.schedule(
      'purge-chat-messages',
      '15 3 * * *',
      'select public.purge_old_chat_messages()'
    );

    if exists (select 1 from cron.job where jobname = 'purge-chat-photos') then
      perform cron.unschedule('purge-chat-photos');
    end if;
    perform cron.schedule(
      'purge-chat-photos',
      '30 3 * * *',
      $cron$
      select net.http_post(
        url := (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'functions_base_url'
          limit 1
        ) || '/purge-chat-photos',
        headers := jsonb_build_object(
          'content-type', 'application/json',
          'x-cron-secret', (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'cron_secret'
            limit 1
          )
        ),
        body := '{}'::jsonb
      );
      $cron$
    );

    if exists (select 1 from cron.job where jobname = 'purge-ephemeral') then
      perform cron.unschedule('purge-ephemeral');
    end if;
    perform cron.schedule(
      'purge-ephemeral',
      '20 * * * *',
      'select public.purge_ephemeral_rows()'
    );

    if exists (select 1 from cron.job where jobname = 'dispatch-rebuild') then
      perform cron.unschedule('dispatch-rebuild');
    end if;
    perform cron.schedule(
      'dispatch-rebuild',
      '*/5 * * * *',
      'select public.dispatch_rebuild()'
    );

    if exists (select 1 from cron.job where jobname = 'trim-cron-history') then
      perform cron.unschedule('trim-cron-history');
    end if;
    perform cron.schedule(
      'trim-cron-history',
      '0 4 * * 0',
      $cron$delete from cron.job_run_details where end_time < now() - interval '14 days'$cron$
    );
  end if;
end
$jobs$;
