-- L2, L3, and private user_routes. Rolls back.
begin;

create extension if not exists pgtap with schema extensions;

select plan(10);

create or replace function pg_temp.become(uid text)
returns void
language plpgsql
as $$
begin
  perform set_config('request.jwt.claim.sub', coalesce(uid, ''), true);
  perform set_config(
    'request.jwt.claim.role',
    case when coalesce(uid, '') = '' then '' else 'authenticated' end,
    true
  );
  perform set_config(
    'request.jwt.claims',
    case
      when coalesce(uid, '') = '' then ''
      else json_build_object('sub', uid, 'role', 'authenticated')::text
    end,
    true
  );
end;
$$;

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token,
  is_sso_user, is_anonymous
) values (
  '00000000-0000-0000-0000-000000000000',
  '44444444-4444-4444-8444-444444444444',
  'authenticated', 'authenticated', 'qa.rider@example.com',
  extensions.crypt('Password10', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"username":"qa_rider"}'::jsonb,
  now(), now(), '', '', '', '', '', '', '', '', false, false
);

do $$ begin perform pg_temp.become('44444444-4444-4444-8444-444444444444'); end $$;
set local role authenticated;

insert into public.user_routes (
  user_id, username, route_title, start_location, end_location, description, is_public
) values
  (
    '44444444-4444-4444-8444-444444444444',
    'qa_rider',
    'Private lake',
    'Ohrid',
    'Struga',
    'Only the owner should see this',
    false
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'qa_rider',
    'Public pass',
    'Ohrid',
    'Galicica',
    'Anyone may read the title',
    true
  );

reset role;
do $$ begin
  perform set_config('soulride.likes_write', '1', true);
  perform set_config('request.jwt.claims', '', true);
  perform set_config('request.jwt.claim.sub', '', true);
end $$;

select throws_ok(
  $$update public.user_routes set likes_count = 999 where route_title = 'Private lake'$$,
  'P0001',
  'likes_count is maintained by user_route_likes',
  'a session GUC cannot bypass likes_count'
);

do $$ begin perform pg_temp.become('44444444-4444-4444-8444-444444444444'); end $$;
set local role authenticated;

insert into public.user_route_likes (route_id, user_id)
select id, '44444444-4444-4444-8444-444444444444'
from public.user_routes
where route_title = 'Private lake';

select is(
  (select likes_count from public.user_routes where route_title = 'Private lake'),
  1,
  'the counter still updates while the GUC is set'
);

insert into public.messages (user_id, username, content, room_name)
values (
  '44444444-4444-4444-8444-444444444444',
  'qa_rider',
  'kept message',
  'Motorbike Riders'
);

select throws_ok(
  $$update public.messages set content = 'rewritten' where content = 'kept message'$$,
  '42501',
  null,
  'authenticated cannot update messages'
);

reset role;
do $$ begin perform pg_temp.become(''); end $$;
set local role anon;

select throws_ok(
  $$insert into public.messages (user_id, username, content, room_name)
    values ('44444444-4444-4444-8444-444444444444', 'qa_rider', 'anon write', 'Motorbike Riders')$$,
  '42501',
  null,
  'anon cannot insert messages'
);

select throws_ok(
  $$update public.messages set content = 'anon rewrite' where content = 'kept message'$$,
  '42501',
  null,
  'anon cannot update messages'
);

select is(
  (select count(*) from public.user_routes where route_title = 'Private lake'),
  0::bigint,
  'anon cannot see a private user route'
);

select is(
  (select route_title from public.user_routes where route_title = 'Public pass'),
  'Public pass',
  'anon can read a public user route'
);

select throws_ok(
  $$select user_id from public.user_routes$$,
  '42501',
  null,
  'anon cannot select user_id'
);

select throws_ok(
  $$select * from public.user_routes$$,
  '42501',
  null,
  'anon select star cannot see user_id'
);

reset role;
do $$ begin perform pg_temp.become('44444444-4444-4444-8444-444444444444'); end $$;
set local role authenticated;

select is(
  (
    select user_id::text
    from public.user_routes
    where route_title = 'Private lake'
  ),
  '44444444-4444-4444-8444-444444444444',
  'the owner can read their private route, including user_id'
);

select * from finish();
rollback;
