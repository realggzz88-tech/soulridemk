-- QA follow-ups on the unmerged stage 2 branch.
-- L2: likes_count cannot be forced with a session GUC.
-- L3: anon cannot insert or update messages; authenticated cannot update them.
-- user_routes are private unless is_public. Anon never receives user_id.

create or replace function public.protect_user_route_likes_count()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.likes_count := 0;
    return new;
  end if;
  -- A direct UPDATE is trigger depth 1, including one made by the table owner
  -- after set_config('soulride.likes_write', '1'). The counter trigger updates
  -- this row from inside another trigger, so its depth is greater than 1.
  -- No custom GUC is consulted.
  if new.likes_count is distinct from old.likes_count and pg_trigger_depth() <= 1 then
    raise exception 'likes_count is maintained by user_route_likes';
  end if;
  return new;
end;
$$;

create or replace function public.sync_user_route_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.user_routes
    set likes_count = likes_count + 1
    where id = new.route_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.user_routes
    set likes_count = greatest(0, likes_count - 1)
    where id = old.route_id;
    return old;
  end if;
  return null;
end;
$$;

revoke insert, update on public.messages from anon, public;
revoke update on public.messages from authenticated;

alter table public.user_routes
  add column if not exists is_public boolean not null default false;

drop policy if exists "User routes are viewable by everyone" on public.user_routes;

create policy "anon reads public user routes"
on public.user_routes
for select
to anon
using (is_public);

create policy "signed-in users read public routes and their own"
on public.user_routes
for select
to authenticated
using (is_public or user_id = auth.uid() or public.is_admin());

revoke select on public.user_routes from anon, public;
grant select (
  id,
  username,
  route_title,
  start_location,
  end_location,
  description,
  likes_count,
  created_at,
  route_photo_url,
  is_public
) on public.user_routes to anon;

grant update (is_public) on public.user_routes to authenticated;
