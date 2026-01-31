-- Fix: remove "Admins can read all profiles" policy that causes infinite recursion.
-- That policy did SELECT from profiles inside a SELECT policy on profiles.
-- Each user (including admins) can still read their own profile via "Users can read own profile".

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
