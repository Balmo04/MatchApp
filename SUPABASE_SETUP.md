# Guía de Configuración de Supabase para MatchApp

Esta guía te ayudará a configurar Supabase para que el login y registro por email funcionen correctamente.

## 📋 Checklist Rápido

- [ ] Email provider habilitado
- [ ] Email confirmation **desactivada**
- [ ] Script SQL `setup_complete.sql` ejecutado
- [ ] Script de verificación `verify_setup.sql` ejecutado sin errores
- [ ] Storage bucket `product-images` creado y público
- [ ] Variables `.env.local` configuradas

## 🚀 Pasos Detallados

### Paso 1: Habilitar Email Provider

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Authentication** → **Providers**
3. Busca **Email** en la lista
4. Haz clic en **Email** para abrir su configuración
5. Asegúrate de que el toggle **"Enable Email provider"** esté **activado** (ON)
6. Guarda los cambios

### Paso 2: Desactivar Confirmación de Email ⚠️ CRÍTICO

**Este paso es esencial** para que el registro funcione sin confirmación:

1. En la misma página de configuración de **Email**
2. Busca la sección **"Email Auth"** o **"Email Settings"**
3. Localiza la opción **"Confirm email"** o **"Enable email confirmations"**
4. **Desactiva** esta opción (toggle OFF)
5. Guarda los cambios

**¿Por qué es crítico?**
- Con confirmación activada, `auth.signUp()` devuelve `session: null`
- Sin sesión, `auth.uid()` es null y falla el INSERT en `profiles` por RLS
- Con confirmación desactivada, el usuario entra inmediatamente tras registrarse

### Paso 3: Ejecutar Script SQL Completo

1. Ve a **SQL Editor** en el Dashboard
2. Abre el archivo `supabase/setup_complete.sql` de este proyecto
3. Copia todo el contenido del archivo
4. Pégalo en el SQL Editor de Supabase
5. Haz clic en **Run** o presiona `Ctrl+Enter`
6. Verifica que no haya errores (debería mostrar "Success. No rows returned")

**¿Qué hace este script?**
- Crea las tablas: `profiles`, `products`, `credit_transactions`
- Configura todas las políticas RLS necesarias
- Crea la política crítica **"Users can insert own profile on signup"**
- Elimina el trigger (el cliente crea el perfil)
- Configura políticas de storage para `product-images`

### Paso 4: Verificar Configuración

1. En el **SQL Editor**, abre el archivo `supabase/verify_setup.sql`
2. Copia y ejecuta el contenido
3. Revisa los resultados:
   - ✓ = Correcto
   - ✗ = Necesita corrección

**Si ves errores:**
- Revisa qué falta según los mensajes del script
- Ejecuta las correcciones necesarias
- Vuelve a ejecutar `verify_setup.sql`

### Paso 5: Crear Storage Bucket

1. Ve a **Storage** en el Dashboard
2. Si no existe el bucket `product-images`:
   - Haz clic en **"New bucket"** o **"Create bucket"**
   - Nombre: `product-images`
   - Marca **"Public bucket"** (toggle ON)
   - Haz clic en **Create**
3. Si ya existe, verifica que esté marcado como **público**

### Paso 6: Configurar Variables de Entorno

1. En Supabase Dashboard, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. En tu proyecto local, edita `.env.local`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Guarda el archivo
5. Reinicia el servidor de desarrollo (`npm run dev`)

## ✅ Verificación Final

Después de completar todos los pasos, prueba:

### 1. Registro de Usuario Nuevo
- Registra un nuevo usuario con email/password
- **Esperado**: Debe crear la cuenta y entrar directamente
- **Esperado**: Debe crear una fila en `profiles` con 5 credits
- **Esperado**: NO debe aparecer error de RLS

### 2. Registro con Email Existente
- Intenta registrarte de nuevo con el mismo email
- **Esperado**: Debe mostrar "Este correo ya está registrado. Inicia sesión."
- **Esperado**: Debe cambiar automáticamente al formulario de login

### 3. Login
- Inicia sesión con email/password correctos
- **Esperado**: Debe funcionar correctamente
- **Esperado**: Debe cargar el perfil del usuario

## 🔧 Troubleshooting

### Error: "new row violates row-level security policy"

**Causas posibles:**
1. Email confirmation está activada → Desactívala en Authentication → Providers → Email
2. Falta la política INSERT → Ejecuta `setup_complete.sql` nuevamente
3. `auth.uid()` es null → Verifica que email confirmation esté desactivada

**Solución:**
```sql
-- Verifica que existe la política
SELECT * FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'INSERT';

-- Si no existe, ejecuta:
CREATE POLICY "Users can insert own profile on signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Error: "User already registered" pero no cambia a login

**Causa**: El código en `App.tsx` no está manejando el error correctamente

**Solución**: Verifica que el código tenga:
```typescript
if (error.message?.includes('ya está registrado')) {
  setIsRegistering(false);
  setAuthError('Este correo ya está registrado. Inicia sesión.');
}
```

### Usuario no entra tras registrarse

**Causas posibles:**
1. Email confirmation está activada
2. `onAuthStateChange` no está configurado
3. Error en la creación del perfil

**Solución:**
1. Verifica que email confirmation esté **desactivada**
2. Revisa la consola del navegador para errores
3. Verifica que el perfil se creó en la tabla `profiles`:
```sql
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;
```

### Storage bucket no funciona

**Solución:**
1. Verifica que el bucket `product-images` existe
2. Verifica que está marcado como público
3. Verifica las políticas de storage ejecutando:
```sql
SELECT * FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';
```

## 📚 Recursos Adicionales

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Storage Policies](https://supabase.com/docs/guides/storage/policies)

## 🆘 ¿Necesitas Ayuda?

Si después de seguir esta guía sigues teniendo problemas:

1. Ejecuta `verify_setup.sql` y comparte los resultados
2. Revisa la consola del navegador para errores específicos
3. Verifica que todas las migraciones se aplicaron correctamente
4. Asegúrate de que email confirmation está **desactivada**
