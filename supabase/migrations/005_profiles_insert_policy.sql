-- Allow user to insert their own profile row (for signup flow; auth.uid() = id after setSession).
DROP POLICY IF EXISTS "Users can insert own profile on signup" ON public.profiles;
CREATE POLICY "Users can insert own profile on signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
