-- Fix: "Database error saving new user" — ensure trigger runs as table owner so RLS is bypassed.
-- The trigger inserts into public.profiles; if the function owner is not postgres, RLS can block the insert.
-- Recreate function and set owner to postgres so SECURITY DEFINER runs with postgres privileges.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    5,
    (NEW.email = 'admin@match.com' OR (NEW.raw_user_meta_data->>'is_admin') = 'true')
  );
  RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
