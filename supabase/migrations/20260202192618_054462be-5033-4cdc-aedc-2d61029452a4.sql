-- Create chat_rooms table
CREATE TABLE public.chat_rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on chat_rooms
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

-- Everyone can view chat rooms
CREATE POLICY "Chat rooms are viewable by everyone"
ON public.chat_rooms
FOR SELECT
USING (true);

-- Add room_name column to messages table
ALTER TABLE public.messages
ADD COLUMN room_name text NOT NULL DEFAULT 'Motorbike Riders';

-- Pre-populate chat rooms
INSERT INTO public.chat_rooms (name, description) VALUES
  ('Motorbike Riders', 'Motorcycle routes, gear tips, winding roads, and soulful bike adventures in Macedonia.'),
  ('Offroaders', '4x4, dirt bikes, rough tracks, off-grid spots, and wild explorations.'),
  ('Explorers', 'Hidden gems, soul views, travel stories, and discovering non-touristy places.'),
  ('Scenic Drivers', 'Car drives, peaceful roads, viewpoints, sunsets, and relaxed journeys.'),
  ('Hikers & Wanderers', 'Trails, mountain walks, nature meditation, and on-foot soul rides.');