-- =================================================
-- SECURITY FIX: Protect user email addresses from public exposure
-- =================================================

-- 1. Drop the existing overly-permissive SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 2. Create a public view that excludes the email column
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  username,
  bio,
  what_you_ride,
  profile_photo_url,
  ride_photo_url,
  created_at,
  updated_at
FROM public.profiles;

-- 3. Users can view their own full profile (including email)
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- 4. Authenticated users can view other profiles (but client should use the view)
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
USING (auth.role() = 'authenticated');

-- =================================================
-- SECURITY FIX: Add message content length constraints
-- =================================================

-- Add length constraint for message content (max 5000 characters)
ALTER TABLE public.messages 
ADD CONSTRAINT messages_content_length 
CHECK (char_length(content) <= 5000);

-- Add constraint to ensure messages have content or image
ALTER TABLE public.messages
ADD CONSTRAINT messages_not_empty
CHECK (char_length(trim(content)) > 0 OR image_url IS NOT NULL);

-- =================================================
-- SECURITY FIX: Add explicit write deny policies for chat_rooms
-- =================================================

-- No one can insert chat rooms (admin-managed only via service role)
CREATE POLICY "No user can insert chat rooms"
ON public.chat_rooms FOR INSERT
WITH CHECK (false);

-- No one can update chat rooms
CREATE POLICY "No user can update chat rooms"
ON public.chat_rooms FOR UPDATE
USING (false);

-- No one can delete chat rooms
CREATE POLICY "No user can delete chat rooms"
ON public.chat_rooms FOR DELETE
USING (false);