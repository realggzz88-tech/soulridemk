-- S6: the owner may update profile text and photo URLs only.
-- Roles live in user_roles. There is no role column on profiles.

revoke update on public.profiles from authenticated, anon, public;

grant update (
  username,
  bio,
  what_you_ride,
  profile_photo_url,
  ride_photo_url
) on public.profiles to authenticated;
