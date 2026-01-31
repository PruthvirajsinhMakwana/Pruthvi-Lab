-- Drop existing triggers if they exist and recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- Update handle_new_user to better capture Google OAuth data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_full_name TEXT;
  user_avatar TEXT;
  user_provider TEXT;
BEGIN
  -- Extract name from various possible metadata fields (Google uses 'name' and 'full_name')
  user_full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'user_name',
    split_part(NEW.email, '@', 1)
  );
  
  -- Extract avatar URL (Google uses 'picture' or 'avatar_url')
  user_avatar := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'picture'
  );
  
  -- Get the auth provider
  user_provider := COALESCE(NEW.raw_app_meta_data ->> 'provider', 'email');
  
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_avatar
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = now();
  
  -- Insert default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  
  -- Add to marketing subscribers with provider source
  INSERT INTO public.marketing_subscribers (email, full_name, user_id, source)
  VALUES (
    NEW.email,
    user_full_name,
    NEW.id,
    CASE 
      WHEN user_provider = 'google' THEN 'google_signup'
      WHEN user_provider = 'apple' THEN 'apple_signup'
      ELSE 'signup'
    END
  )
  ON CONFLICT (email) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    full_name = COALESCE(EXCLUDED.full_name, marketing_subscribers.full_name),
    source = EXCLUDED.source,
    updated_at = now();
  
  RETURN NEW;
END;
$function$;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Drop the old add_marketing_subscriber function since we consolidated it
DROP FUNCTION IF EXISTS public.add_marketing_subscriber() CASCADE;