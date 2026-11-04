-- S5: likes_count is a counter. Users like through user_route_likes.

create table public.user_route_likes (
  route_id uuid not null references public.user_routes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (route_id, user_id)
);

alter table public.user_route_likes enable row level security;

create policy "riders read their own likes"
on public.user_route_likes
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "riders like as themselves"
on public.user_route_likes
for insert
to authenticated
with check (user_id = auth.uid());

create policy "riders remove their own likes"
on public.user_route_likes
for delete
to authenticated
using (user_id = auth.uid());

revoke all on public.user_route_likes from anon, authenticated;
grant select, insert, delete on public.user_route_likes to authenticated;
grant all on public.user_route_likes to service_role;

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
  if new.likes_count is distinct from old.likes_count
     and current_setting('soulride.likes_write', true) is distinct from '1' then
    raise exception 'likes_count is maintained by user_route_likes';
  end if;
  return new;
end;
$$;

drop trigger if exists user_routes_likes_guard on public.user_routes;
create trigger user_routes_likes_guard
before insert or update on public.user_routes
for each row execute function public.protect_user_route_likes_count();

create or replace function public.sync_user_route_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform set_config('soulride.likes_write', '1', true);
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

drop trigger if exists user_route_likes_count on public.user_route_likes;
create trigger user_route_likes_count
after insert or delete on public.user_route_likes
for each row execute function public.sync_user_route_likes_count();

revoke update on public.user_routes from authenticated, anon, public;
grant update (
  route_title,
  start_location,
  end_location,
  description,
  route_photo_url
) on public.user_routes to authenticated;
