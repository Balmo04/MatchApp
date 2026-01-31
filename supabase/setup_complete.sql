-- ============================================================================
-- SETUP COMPLETO DE SUPABASE PARA MATCHAPP
-- Ejecuta este script completo en Supabase SQL Editor
-- ============================================================================
-- Este script consolida todas las migraciones necesarias en el orden correcto
-- para habilitar email login y registro sin confirmación de email.
-- ============================================================================

-- ============================================================================
-- MIGRACIÓN 001: Schema inicial
-- ============================================================================

-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== PROFILES ==========
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  credits int NOT NULL DEFAULT 5,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ========== PRODUCTS ==========
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  description text,
  image_path text NOT NULL,
  prompt_fragment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read products
DROP POLICY IF EXISTS "Authenticated users can read products" ON public.products;
CREATE POLICY "Authenticated users can read products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert/update/delete products
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- ========== CREDIT_TRANSACTIONS ==========
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own transactions" ON public.credit_transactions;
CREATE POLICY "Users can read own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own transactions" ON public.credit_transactions;
CREATE POLICY "Users can insert own transactions"
  ON public.credit_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ========== STORAGE: product-images bucket ==========
-- Bucket must be created in Dashboard or via API; policies below assume bucket name 'product-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read for product images
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only authenticated users with is_admin can upload to product-images
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.is_admin = true
    )
  );

-- ============================================================================
-- MIGRACIÓN 002: Fix RLS recursion
-- ============================================================================

-- Fix: remove "Admins can read all profiles" policy that causes infinite recursion.
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

-- ============================================================================
-- MIGRACIÓN 005: Policy de INSERT para profiles (CRÍTICA)
-- ============================================================================

-- Allow user to insert their own profile row (for signup flow; auth.uid() = id after setSession).
DROP POLICY IF EXISTS "Users can insert own profile on signup" ON public.profiles;
CREATE POLICY "Users can insert own profile on signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- MIGRACIÓN 004: Remover trigger (el cliente crea el perfil)
-- ============================================================================

-- Remove trigger that causes "Database error saving new user" (RLS blocks insert in trigger context).
-- Profile is now created from the client after signUp, using policy "Users can insert own profile on signup".
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================================================
-- SETUP COMPLETADO
-- ============================================================================
-- Próximos pasos:
-- 1. Ve a Authentication → Providers → Email y desactiva "Confirm email"
-- 2. Verifica que el bucket 'product-images' existe en Storage
-- 3. Ejecuta el script de verificación: verify_setup.sql
-- ============================================================================
