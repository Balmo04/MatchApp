-- Remove trigger that causes "Database error saving new user" (RLS blocks insert in trigger context).
-- Profile is now created from the client after signUp, using policy "Users can insert own profile on signup".

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
