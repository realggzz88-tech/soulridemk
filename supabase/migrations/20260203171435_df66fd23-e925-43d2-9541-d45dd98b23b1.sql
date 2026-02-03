-- =================================================
-- SECURITY FIX: Add input validation constraints
-- =================================================

-- Profiles table constraints
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_bio_length CHECK (bio IS NULL OR char_length(bio) <= 500);

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_what_you_ride_length CHECK (what_you_ride IS NULL OR char_length(what_you_ride) <= 200);

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20);

-- User routes table constraints
ALTER TABLE public.user_routes
ADD CONSTRAINT routes_title_length CHECK (char_length(route_title) <= 100);

ALTER TABLE public.user_routes
ADD CONSTRAINT routes_location_length CHECK (
  char_length(start_location) <= 200 AND 
  char_length(end_location) <= 200
);

ALTER TABLE public.user_routes
ADD CONSTRAINT routes_description_length CHECK (char_length(description) <= 2000);

-- =================================================
-- SECURITY FIX: Restrict chat-photos uploads to user folders
-- =================================================

-- Drop the overly-permissive policy
DROP POLICY IF EXISTS "Authenticated users can upload chat photos" ON storage.objects;

-- Create folder-scoped policy like other buckets
CREATE POLICY "Authenticated users can upload to own chat folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chat-photos' AND 
  auth.role() = 'authenticated' AND
  auth.uid()::text = (storage.foldername(name))[1]
);