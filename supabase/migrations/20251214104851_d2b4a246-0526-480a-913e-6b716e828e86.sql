-- Drop the current public policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a view for public profile access that excludes sensitive data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  bio,
  skills,
  interests,
  skill_level,
  learning_goals,
  onboarding_completed,
  created_at,
  updated_at
  -- Explicitly excluding: email
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Update RLS: Only users can see their own full profile (including email)
-- Admins can see all profiles
CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin'));