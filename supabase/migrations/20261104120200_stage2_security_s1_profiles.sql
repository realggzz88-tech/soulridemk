-- S1: email lives in auth.users. Signed-in users can read profiles.
-- profiles_public stays security_invoker, so it follows the same RLS and has no email.

drop view if exists public.profiles_public;

alter table public.profiles drop column if exists email;

create view public.profiles_public
with (security_invoker = on) as
select
  id,
  user_id,
  username,
  bio,
  what_you_ride,
  profile_photo_url,
  ride_photo_url,
  created_at,
  updated_at
from public.profiles;

grant select on public.profiles_public to anon, authenticated;

drop policy if exists "Users can view their own profile" on public.profiles;

create policy "profiles readable by signed-in users"
on public.profiles
for select
to authenticated
using (true);

-- Keep signup working after the email column is gone. S7 replaces this with
-- conflict-safe username sanitising.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
begin
  base := trim(both from coalesce(
    new.raw_user_meta_data ->> 'username',
    split_part(coalesce(new.email, ''), '@', 1)
  ));
  if base is null or char_length(base) < 3 then
    base := 'rider_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;
  if char_length(base) > 20 then
    base := left(base, 20);
  end if;
  insert into public.profiles (user_id, username)
  values (new.id, base);
  return new;
end;
$$;
