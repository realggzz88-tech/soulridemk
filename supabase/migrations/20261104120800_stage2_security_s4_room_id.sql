-- S4: messages.room_id is a real chat room.
-- Legacy clients that only send room_name still work when the name matches a room.
-- The stored room_name is always overwritten from chat_rooms.

alter table public.messages
  add column room_id uuid references public.chat_rooms (id);

update public.messages m
set room_id = c.id
from public.chat_rooms c
where c.name = m.room_name
  and m.room_id is null;

update public.messages
set room_id = (
  select id from public.chat_rooms where name = 'Motorbike Riders'
)
where room_id is null;

alter table public.messages
  alter column room_id set not null;

create index messages_room_id_idx on public.messages (room_id);

create or replace function public.prepare_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_name text;
  resolved_name text;
begin
  select username into profile_name
  from public.profiles
  where user_id = new.user_id;

  if profile_name is null then
    raise exception 'message author has no profile';
  end if;
  new.username := profile_name;

  if new.room_id is null then
    select id into new.room_id
    from public.chat_rooms
    where name = new.room_name;
  end if;

  select name into resolved_name
  from public.chat_rooms
  where id = new.room_id;

  if resolved_name is null then
    raise exception 'unknown chat room';
  end if;
  new.room_name := resolved_name;

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

drop policy if exists "Authenticated users can insert messages" on public.messages;

create policy "Authenticated users can insert messages"
on public.messages
for insert
to authenticated
with check (
  auth.uid() = user_id
  and room_id is not null
  and exists (
    select 1 from public.chat_rooms c where c.id = room_id
  )
);
