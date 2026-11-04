-- S9: new uploads use <uid>/<uuid>.webp|jpg|jpeg|png so the client does not need upsert.
-- Existing owner UPDATE policies on avatars, rides and route-photos stay.
-- The stage 1 migrations already gave rides an UPDATE policy (the spec text said
-- rides had none). chat-photos still has no UPDATE policy.
-- Clients should upload a new uuid filename and stop passing upsert:true.

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and name ~ (
    '^' || auth.uid()::text
    || '/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.(webp|jpe?g|png)$'
  )
  and public.my_upload_count() < 80
);

drop policy if exists "Users can upload their own ride photo" on storage.objects;
create policy "Users can upload their own ride photo"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'rides'
  and name ~ (
    '^' || auth.uid()::text
    || '/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.(webp|jpe?g|png)$'
  )
  and public.my_upload_count() < 80
);

drop policy if exists "Users can upload route photos" on storage.objects;
create policy "Users can upload route photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'route-photos'
  and name ~ (
    '^' || auth.uid()::text
    || '/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.(webp|jpe?g|png)$'
  )
  and public.my_upload_count() < 80
);

drop policy if exists "Authenticated users can upload to own chat folder" on storage.objects;
create policy "Authenticated users can upload to own chat folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'chat-photos'
  and name ~ (
    '^' || auth.uid()::text
    || '/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.(webp|jpe?g|png)$'
  )
  and public.my_upload_count() < 80
);
