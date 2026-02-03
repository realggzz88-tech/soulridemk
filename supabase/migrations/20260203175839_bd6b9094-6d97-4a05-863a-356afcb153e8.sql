-- Fix: Remove overly permissive SELECT policy that exposes emails to all authenticated users
-- The profiles_public view (which excludes email) should be used for public profile data

DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Keep only the policy that allows users to view their own profile
-- The existing "Users can view their own profile" policy already handles this correctly