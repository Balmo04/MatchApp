-- ============================================================================
-- SCRIPT DE VERIFICACIÓN DE CONFIGURACIÓN SUPABASE
-- Ejecuta este script después de setup_complete.sql para verificar que todo está correcto
-- ============================================================================

-- Verificar que las tablas existen
SELECT 
  'Tablas' as tipo,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
      AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products')
      AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'credit_transactions')
    THEN '✓ Todas las tablas existen'
    ELSE '✗ Faltan tablas'
  END as estado;

-- Verificar políticas RLS en profiles
SELECT 
  'Políticas RLS de profiles' as tipo,
  policyname as nombre_politica,
  cmd as operacion
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public'
ORDER BY cmd, policyname;

-- Verificar que existe la política crítica de INSERT
SELECT 
  'Política INSERT crítica' as tipo,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'profiles' 
      AND schemaname = 'public'
      AND cmd = 'INSERT'
      AND policyname = 'Users can insert own profile on signup'
    )
    THEN '✓ Política INSERT existe'
    ELSE '✗ FALTA política INSERT - CRÍTICO'
  END as estado;

-- Verificar que el trigger NO existe (debe estar removido)
SELECT 
  'Trigger handle_new_user' as tipo,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_trigger 
      WHERE tgname = 'on_auth_user_created'
    )
    THEN '✗ Trigger aún existe - debe ser removido'
    ELSE '✓ Trigger removido correctamente'
  END as estado;

-- Verificar storage bucket
SELECT 
  'Storage bucket product-images' as tipo,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM storage.buckets 
      WHERE id = 'product-images'
    )
    THEN '✓ Bucket existe'
    ELSE '✗ Bucket NO existe - créalo en Storage → New bucket'
  END as estado;

-- Verificar políticas de storage
SELECT 
  'Políticas de Storage' as tipo,
  policyname as nombre_politica,
  cmd as operacion
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%product%'
ORDER BY cmd, policyname;

-- Resumen de verificación
SELECT 
  'RESUMEN' as tipo,
  CASE 
    WHEN 
      EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles')
      AND EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public' AND cmd = 'INSERT')
      AND NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created')
    THEN '✓ Configuración básica correcta'
    ELSE '✗ Revisa los errores arriba'
  END as estado_final;
