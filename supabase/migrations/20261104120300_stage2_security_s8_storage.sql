-- S8: no public file listing, 1 MB and image MIME limits, per-user object cap.
-- Add the limit columns when an older storage schema does not have them yet.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'storage' and table_name = 'buckets' and column_name = 'file_size_limit'
  ) then
    alter table storage.buckets add column file_size_limit bigint;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'storage' and table_name = 'buckets' and column_name = 'allowed_mime_types'
  ) then
    alter table storage.buckets add column allowed_mime_types text[];
  end if;
end
$$;

-- S8: no public file listing, 1 MB and image MIME limits, per-user object cap.
-- Public buckets still serve a file when the URL is known. Listing needs SELECT,
-- and these policies are gone.
-- Cap is 80 objects across the four upload buckets (the spec did not set a number).
-- At the 1 MB object cap that is about 80 MB per user, so one account cannot fill
-- the 1 GB free storage quota.

update storage.buckets
set
  file_size_limit = 1048576,
  allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png']::text[]
where id in ('avatars', 'rides', 'route-photos', 'chat-photos');

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Ride images are publicly accessible" on storage.objects;
drop policy if exists "Route photos are publicly accessible" on storage.objects;
drop policy if exists "Chat photos are publicly accessible" on storage.objects;

create or replace function public.my_upload_count()
returns int
language sql
stable
security definer
set search_path = storage, public
as $$
  select count(*)::int
  from storage.objects
  where bucket_id in ('avatars', 'rides', 'route-photos', 'chat-photos')
    and (storage.foldername(name))[1] = auth.uid()::text;
$$;

revoke all on function public.my_upload_count() from public;
grant execute on function public.my_upload_count() to authenticated;

-- Insert policies are replaced again in S9 to require <uid>/<uuid>.<ext>.
-- The quota check is included here so this migration is safe on its own.

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
  and public.my_upload_count() < 80
);

drop policy if exists "Users can upload their own ride photo" on storage.objects;
create policy "Users can upload their own ride photo"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'rides'
  and auth.uid()::text = (storage.foldername(name))[1]
  and public.my_upload_count() < 80
);

drop policy if exists "Users can upload route photos" on storage.objects;
create policy "Users can upload route photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'route-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
  and public.my_upload_count() < 80
);

drop policy if exists "Authenticated users can upload to own chat folder" on storage.objects;
create policy "Authenticated users can upload to own chat folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'chat-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
  and public.my_upload_count() < 80
);
