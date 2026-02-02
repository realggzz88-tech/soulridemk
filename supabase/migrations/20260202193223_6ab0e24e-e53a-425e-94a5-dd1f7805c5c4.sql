-- Add photo columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS profile_photo_url text,
ADD COLUMN IF NOT EXISTS ride_photo_url text;

-- Add photo column to user_routes table
ALTER TABLE public.user_routes
ADD COLUMN IF NOT EXISTS route_photo_url text;

-- Add image_url column to messages table for photo messages
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS image_url text;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('rides', 'rides', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('route-photos', 'route-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-photos', 'chat-photos', true);

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for rides bucket
CREATE POLICY "Ride images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'rides');

CREATE POLICY "Users can upload their own ride photo"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'rides' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own ride photo"
ON storage.objects FOR UPDATE
USING (bucket_id = 'rides' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own ride photo"
ON storage.objects FOR DELETE
USING (bucket_id = 'rides' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for route-photos bucket
CREATE POLICY "Route photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'route-photos');

CREATE POLICY "Users can upload route photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'route-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their route photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'route-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their route photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'route-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for chat-photos bucket
CREATE POLICY "Chat photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-photos');

CREATE POLICY "Authenticated users can upload chat photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own chat photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-photos' AND auth.uid()::text = (storage.foldername(name))[1]);