-- S3: username comes from the profile, not the client.
-- image_url must be a chat-photos object under the author's own folder.
-- The host is not hardcoded: local, staging and prod each have their own URL,
-- and the legacy Lovable project must not be baked into a check.

create or replace function public.prepare_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_name text;
begin
  select username into profile_name
  from public.profiles
  where user_id = new.user_id;

  if profile_name is null then
    raise exception 'message author has no profile';
  end if;
  new.username := profile_name;

  if new.image_url is not null then
    if new.image_url !~ '^https?://[^/[:space:]]+/storage/v1/object/public/chat-photos/[0-9a-fA-F-]{36}/[0-9a-fA-F-]{36}\.(webp|jpe?g|png)$' then
      raise exception 'image_url must be a chat-photos object url';
    end if;
    if position('/chat-photos/' || new.user_id::text || '/' in new.image_url) = 0 then
      raise exception 'image_url must be in the author folder';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists messages_prepare on public.messages;
create trigger messages_prepare
before insert or update on public.messages
for each row execute function public.prepare_message();

create or replace function public.prepare_user_route()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_name text;
begin
  select username into profile_name
  from public.profiles
  where user_id = new.user_id;

  if profile_name is null then
    raise exception 'route author has no profile';
  end if;
  new.username := profile_name;
  return new;
end;
$$;

drop trigger if exists user_routes_prepare on public.user_routes;
create trigger user_routes_prepare
before insert or update on public.user_routes
for each row execute function public.prepare_user_route();
