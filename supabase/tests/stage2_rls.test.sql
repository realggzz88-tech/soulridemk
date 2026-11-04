-- RLS and retention checks for the stage 2 schema.
-- Run with: supabase test db
-- The file rolls back, so it does not keep the users it creates.

begin;

create extension if not exists pgtap with schema extensions;

select plan(36);

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

select ok(
  (select relrowsecurity from pg_class where oid = 'public.messages'::regclass),
  'messages has RLS'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.spots'::regclass),
  'spots has RLS'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'profiles has RLS'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.favorites'::regclass),
  'favorites has RLS'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.user_route_likes'::regclass),
  'likes has RLS'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.weather_cache'::regclass),
  'weather cache has RLS'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'storage.objects'::regclass),
  'storage.objects has RLS'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new,
  email_change_token_current, phone_change, phone_change_token, reauthentication_token,
  is_sso_user, is_anonymous
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated', 'authenticated', 'rider.one@example.com',
    extensions.crypt('Password10', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"rider_one"}'::jsonb,
    now(), now(), '', '', '', '', '', '', '', '', false, false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222222',
    'authenticated', 'authenticated', 'rider.two@example.com',
    extensions.crypt('Password10', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"rider_two"}'::jsonb,
    now(), now(), '', '', '', '', '', '', '', '', false, false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333333',
    'authenticated', 'authenticated', 'admin.one@example.com',
    extensions.crypt('Password10', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"admin_one"}'::jsonb,
    now(), now(), '', '', '', '', '', '', '', '', false, false
  );

insert into public.user_roles (user_id, role)
values ('33333333-3333-4333-8333-333333333333', 'admin');

insert into public.messages (user_id, username, content, room_name)
values (
  '11111111-1111-4111-8111-111111111111',
  'not-the-real-name',
  'hello from the road',
  'Motorbike Riders'
);

select is(
  (select username from public.messages where content = 'hello from the road'),
  'rider_one',
  'message username is taken from the profile'
);

do $$ begin perform pg_temp.become(''); end $$;
set local role anon;

select is(
  (select count(*) from public.messages),
  0::bigint,
  'anon cannot read chat'
);
select is(
  (select count(*) from public.profiles),
  0::bigint,
  'anon cannot read profiles'
);
select is(
  (select count(*) from public.spots),
  0::bigint,
  'anon cannot read draft spots'
);

reset role;
do $$ begin perform pg_temp.become('11111111-1111-4111-8111-111111111111'); end $$;
set local role authenticated;

select is(
  (select count(*) from public.messages),
  1::bigint,
  'signed-in users can read chat'
);

update public.profiles
set bio = 'stolen'
where user_id = '22222222-2222-4222-8222-222222222222';

select is(
  (select bio from public.profiles where user_id = '22222222-2222-4222-8222-222222222222'),
  null,
  'a user cannot edit another profile'
);

update public.profiles
set bio = 'two wheels'
where user_id = '11111111-1111-4111-8111-111111111111';

select is(
  (select bio from public.profiles where user_id = '11111111-1111-4111-8111-111111111111'),
  'two wheels',
  'a user can edit their own bio'
);

select throws_ok(
  $$update public.profiles set created_at = now() where user_id = '11111111-1111-4111-8111-111111111111'$$,
  '42501',
  null,
  'a user cannot update restricted profile columns'
);

select throws_ok(
  $$insert into public.spots (slug, region, lat, lng, name_en, status, mk_status)
    values ('zz-not-admin', 'West', 41.1, 21.4, 'Nope', 'draft', 'machine')$$,
  '42501',
  null,
  'a non-admin cannot write spots'
);

insert into public.user_routes (
  user_id, username, route_title, start_location, end_location, description, likes_count
) values (
  '11111111-1111-4111-8111-111111111111',
  'someone-else',
  'Lake loop',
  'Ohrid',
  'Struga',
  'A quiet evening ride',
  40
);

select is(
  (select username from public.user_routes where route_title = 'Lake loop'),
  'rider_one',
  'route username is taken from the profile'
);
select is(
  (select likes_count from public.user_routes where route_title = 'Lake loop'),
  0,
  'insert cannot set likes_count'
);

select throws_ok(
  $$update public.user_routes set likes_count = 99 where route_title = 'Lake loop'$$,
  '42501',
  null,
  'a user cannot set likes_count'
);

insert into public.user_route_likes (route_id, user_id)
select id, '11111111-1111-4111-8111-111111111111'
from public.user_routes
where route_title = 'Lake loop';

select is(
  (select likes_count from public.user_routes where route_title = 'Lake loop'),
  1,
  'a like increments the counter'
);

select throws_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('chat-photos', '11111111-1111-4111-8111-111111111111/not-a-uuid.txt')$$,
  '42501',
  null,
  'upload names must be uid/uuid.ext'
);

reset role;
do $$ begin perform pg_temp.become(''); end $$;

insert into storage.objects (bucket_id, name, owner)
values (
  'avatars',
  '11111111-1111-4111-8111-111111111111/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.webp',
  '11111111-1111-4111-8111-111111111111'
);

set local role anon;
select is(
  (select count(*) from storage.objects where bucket_id = 'avatars'),
  0::bigint,
  'anon cannot list storage files'
);
reset role;

do $$ begin perform pg_temp.become('33333333-3333-4333-8333-333333333333'); end $$;
set local role authenticated;

select lives_ok(
  $$insert into public.spots (slug, region, lat, lng, name_mk, name_en, description_mk, description_en, tagline_mk, tagline_en, mk_status, status)
    values ('zz-admin-spot', 'West', 41.2, 21.5, 'Проба', 'Probe', 'Опис за проба', 'Probe description', 'Ред', 'Line', 'reviewed', 'published')$$,
  'an admin can write a published spot'
);

reset role;
do $$ begin perform pg_temp.become(''); end $$;
set local role anon;

select is(
  (select count(*) from public.spots where slug = 'zz-admin-spot'),
  1::bigint,
  'anon can read a published spot'
);
select is(
  (select count(*) from public.spots where slug = 'galicica-pass'),
  0::bigint,
  'anon cannot read a draft spot'
);

reset role;
do $$ begin perform pg_temp.become(''); end $$;

select throws_ok(
  $$update public.routes
    set status = 'published', mk_status = 'reviewed'
    where slug = 'eastern-waterfalls-loop'$$,
  'P0001',
  'route eastern-waterfalls-loop has unpublished stops',
  'a route cannot publish while a stop is draft'
);

select is((select count(*) from public.spots), 37::bigint, '36 seeded spots plus the admin probe');
select is((select count(*) from public.routes), 7::bigint, '7 routes');
select is((select count(*) from public.route_spots), 16::bigint, '16 stops');
select is(
  (select status::text from public.spots where slug = 'vodoca-monastery'),
  'draft',
  'vodoca-monastery stays a draft'
);

do $$ begin perform pg_temp.become('33333333-3333-4333-8333-333333333333'); end $$;

update public.spots
set name_en = 'EDITED BY ADMIN'
where slug = 'galicica-pass';

do $$ begin perform pg_temp.become(''); end $$;

update public.spots
set name_en = 'TEMP'
where slug = 'vevcani-village';

do $$ begin perform public.apply_content_seed_v1(); end $$;

select is(
  (select name_en from public.spots where slug = 'galicica-pass'),
  'EDITED BY ADMIN',
  'seed does not overwrite an admin edit'
);
select is(
  (select name_en from public.spots where slug = 'vevcani-village'),
  'Vevčani Village',
  'seed restores a row nobody has edited'
);

insert into public.messages (user_id, username, content, room_name, created_at)
values (
  '11111111-1111-4111-8111-111111111111',
  'rider_one',
  'ancient chat',
  'Explorers',
  now() - interval '13 months'
);

do $$ begin perform public.purge_old_chat_messages(); end $$;

select is(
  (select count(*) from public.messages where content = 'ancient chat'),
  0::bigint,
  'messages older than 12 months are purged'
);
select is(
  (select count(*) from public.messages where content = 'hello from the road'),
  1::bigint,
  'fresh messages are kept'
);

insert into public.favorites (user_id, spot_id)
select '22222222-2222-4222-8222-222222222222', id
from public.spots
where slug = 'matka-canyon';

delete from auth.users where id = '22222222-2222-4222-8222-222222222222';

select is(
  (select count(*) from public.profiles where user_id = '22222222-2222-4222-8222-222222222222'),
  0::bigint,
  'deleting the auth user cascades the profile'
);
select is(
  (select count(*) from public.favorites where user_id = '22222222-2222-4222-8222-222222222222'),
  0::bigint,
  'deleting the auth user cascades favourites'
);

select * from finish();

rollback;
