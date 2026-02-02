-- Add bio and what_you_ride columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS what_you_ride text;

-- Create user_routes table for user-submitted recommended routes
CREATE TABLE public.user_routes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  route_title text NOT NULL,
  start_location text NOT NULL,
  end_location text NOT NULL,
  description text NOT NULL,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_routes
ALTER TABLE public.user_routes ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_routes
CREATE POLICY "User routes are viewable by everyone"
ON public.user_routes
FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own routes"
ON public.user_routes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routes"
ON public.user_routes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routes"
ON public.user_routes
FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for user_routes
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_routes;