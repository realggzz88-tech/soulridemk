-- S7: a bad username in signup metadata must not abort the signup.
-- Trim, cut to 20, add a short suffix on conflict, otherwise rider_<8 hex>.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
  n int := 0;
begin
  base := trim(both from coalesce(
    new.raw_user_meta_data ->> 'username',
    split_part(coalesce(new.email, ''), '@', 1)
  ));
  base := regexp_replace(base, '[[:space:]]+', ' ', 'g');

  if base is null or char_length(base) < 3 then
    base := 'rider_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;
  if char_length(base) > 20 then
    base := left(base, 20);
  end if;

  candidate := base;
  while exists (select 1 from public.profiles where username = candidate) loop
    n := n + 1;
    candidate := left(base, 15) || '_' || substr(md5(new.id::text || n::text || random()::text), 1, 4);
    if char_length(candidate) < 3 then
      candidate := 'rider_' || substr(md5(new.id::text || n::text), 1, 8);
    end if;
    exit when n >= 8;
  end loop;

  if exists (select 1 from public.profiles where username = candidate) then
    candidate := 'rider_' || substr(md5(new.id::text || clock_timestamp()::text), 1, 8);
  end if;

  insert into public.profiles (user_id, username)
  values (new.id, candidate);
  return new;
end;
$$;
