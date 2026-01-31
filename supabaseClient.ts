import { createClient } from '@supabase/supabase-js';
import { Product, UserProfile, Category } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Configure .env.local.');
}
// #region agent log
fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:init',message:'env check',data:{hasUrl:!!supabaseUrl,hasKey:!!supabaseAnonKey},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
// #endregion

const client = createClient(supabaseUrl || '', supabaseAnonKey || '');

const BUCKET_PRODUCT_IMAGES = 'product-images';

/** Map DB row to Product with public imageUrl */
function rowToProduct(row: {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_path: string;
  prompt_fragment: string;
  created_at: string;
}): Product {
  const imageUrl =
    client.storage.from(BUCKET_PRODUCT_IMAGES).getPublicUrl(row.image_path).data.publicUrl;
  return {
    id: row.id,
    name: row.name,
    category: row.category as Category,
    price: Number(row.price),
    description: row.description ?? '',
    imageUrl,
    promptFragment: row.prompt_fragment,
    created_at: row.created_at,
  };
}

/** Map DB profile row to UserProfile */
function rowToProfile(row: {
  id: string;
  email: string | null;
  credits: number;
  is_admin: boolean;
}): UserProfile {
  return {
    id: row.id,
    email: row.email ?? '',
    credits: row.credits,
    isAdmin: row.is_admin,
  };
}

export const supabaseService = {
  async getProducts(): Promise<{ data: Product[] | null; error: Error | null }> {
    const { data, error } = await client
      .from('products')
      .select('id, name, category, price, description, image_path, prompt_fragment, created_at')
      .order('created_at', { ascending: false });

    if (error) return { data: null, error };
    return { data: (data ?? []).map(rowToProduct), error: null };
  },

  async uploadProduct(
    product: Partial<Product>,
    imageFile: File
  ): Promise<{ data: Product | null; error: Error | null }> {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:uploadProduct',message:'uploadProduct entry',data:{fileName:imageFile.name,fileSize:imageFile.size},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    const ext = imageFile.name.split('.').pop() || 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:uploadProduct',message:'uploading to storage',data:{path,bucket:BUCKET_PRODUCT_IMAGES},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H'})}).catch(()=>{});
    // #endregion
    const { error: uploadError } = await client.storage
      .from(BUCKET_PRODUCT_IMAGES)
      .upload(path, imageFile, { upsert: true });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:uploadProduct',message:'storage upload returned',data:{hasError:!!uploadError,errorMsg:uploadError?.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    if (uploadError) return { data: null, error: uploadError as unknown as Error };
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:uploadProduct',message:'inserting product row',data:{path},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'J'})}).catch(()=>{});
    // #endregion
    const { data: row, error } = await client
      .from('products')
      .insert({
        name: product.name ?? '',
        category: product.category ?? Category.SHIRTS,
        price: product.price ?? 0,
        description: product.description ?? '',
        image_path: path,
        prompt_fragment: product.promptFragment ?? '',
      })
      .select('id, name, category, price, description, image_path, prompt_fragment, created_at')
      .single();
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:uploadProduct',message:'insert returned',data:{hasRow:!!row,hasError:!!error,errorMsg:error?.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'K'})}).catch(()=>{});
    // #endregion
    if (error) return { data: null, error: error as unknown as Error };
    return { data: rowToProduct(row), error: null };
  },

  async signIn(
    email: string,
    password: string
  ): Promise<{ data: { user: UserProfile } | null; error: Error | null }> {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'signIn entry',data:{email,hasClient:!!client,hasAuth:!!client?.auth},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'calling signInWithPassword',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'signInWithPassword returned',data:{hasData:!!authData,hasError:!!authError},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    if (authError) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'auth failed',data:{msg:authError.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return { data: null, error: authError as unknown as Error };
    }
    if (!authData.user) return { data: null, error: new Error('No user') };
    
    // Obtener perfil completo de la base de datos
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('id, email, credits, is_admin')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError || !profile) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'profile not found',data:{userId:authData.user.id,error:profileError?.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'profile-fetch'})}).catch(()=>{});
      // #endregion
      return { data: null, error: new Error('Profile not found. Please contact support.') };
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'signIn returning full profile',data:{userId:authData.user.id,credits:profile.credits},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'profile-fetch'})}).catch(()=>{});
    // #endregion
    return { data: { user: rowToProfile(profile) }, error: null };
  },

  async signUp(
    email: string,
    password: string
  ): Promise<{ data: { user: UserProfile } | null; error: Error | null }> {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signUp',message:'signUp entry',data:{emailLen:email?.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H2,H4'})}).catch(()=>{});
    // #endregion
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signUp',message:'auth.signUp returned',data:{hasAuthError:!!authError,authErrorMsg:authError?.message?.slice(0,80),hasUser:!!authData?.user,userId:authData?.user?.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H3,H4'})}).catch(()=>{});
    // #endregion
    if (authError) return { data: null, error: authError as unknown as Error };
    if (!authData.user) return { data: null, error: new Error('No user') };

    // Con email confirmation OFF, session null = email ya registrado
    if (!authData.session) {
      return { data: null, error: new Error('Este correo ya está registrado. Inicia sesión.') };
    }

    // Ensure client has session so RLS policy (auth.uid() = id) allows the insert.
    if (authData.session) {
      await client.auth.setSession({
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      });
    }

    // Create profile from client (trigger removed to avoid "Database error saving new user").
    const { error: insertError } = await client.from('profiles').insert({
      id: authData.user.id,
      email: authData.user.email ?? null,
      credits: 5,
      is_admin: authData.user.email === 'admin@match.com',
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signUp',message:'profile insert returned',data:{hasInsertError:!!insertError,insertErrorMsg:insertError?.message?.slice(0,80)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H7'})}).catch(()=>{});
    // #endregion
    if (insertError && (insertError as { code?: string }).code !== '23505') {
      // Mejorar mensaje de error para RLS
      const errorMessage = insertError.message?.includes('row-level security') 
        ? 'Error al crear perfil. Verifica la configuración de Supabase.'
        : insertError.message || 'Error al crear perfil';
      return { data: null, error: new Error(errorMessage) };
    }
    // 23505 = duplicate key; profile may exist from trigger in another env — continue to select

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signUp',message:'before profile fetch',data:{userId:authData.user.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('id, email, credits, is_admin')
      .eq('id', authData.user.id)
      .single();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signUp',message:'profile fetch returned',data:{hasProfileError:!!profileError,profileErrorMsg:profileError?.message?.slice(0,80),hasProfile:!!profile},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2,H4'})}).catch(()=>{});
    // #endregion

    if (profileError || !profile) {
      // Si el perfil no existe después del INSERT, intentar crearlo como fallback
      if (profileError && (profileError as { code?: string }).code === 'PGRST116') {
        // PGRST116 = no rows returned, perfil no existe
        // Intentar crear el perfil nuevamente
        const { error: retryInsertError } = await client.from('profiles').insert({
          id: authData.user.id,
          email: authData.user.email ?? null,
          credits: 5,
          is_admin: authData.user.email === 'admin@match.com',
        });
        
        if (retryInsertError && (retryInsertError as { code?: string }).code !== '23505') {
          return { data: null, error: new Error('No se pudo crear el perfil. Intenta iniciar sesión.') };
        }
        
        // Intentar obtener el perfil nuevamente
        const { data: retryProfile, error: retryError } = await client
          .from('profiles')
          .select('id, email, credits, is_admin')
          .eq('id', authData.user.id)
          .single();
          
        if (retryError || !retryProfile) {
          return { data: null, error: new Error('Perfil no encontrado después del registro. Intenta iniciar sesión.') };
        }
        
        return { data: { user: rowToProfile(retryProfile) }, error: null };
      }
      
      return {
        data: null,
        error: (profileError as Error) ?? new Error('Perfil no encontrado. Intenta iniciar sesión.'),
      };
    }
    return { data: { user: rowToProfile(profile) }, error: null };
  },

  async getProfile(): Promise<{ data: UserProfile | null; error: Error | null }> {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:getProfile',message:'getProfile entry',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    const { data: { user } } = await client.auth.getUser();
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:getProfile',message:'getUser returned',data:{hasUser:!!user,userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    if (!user) return { data: null, error: null };

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:getProfile',message:'querying profiles',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2,H3,H5'})}).catch(()=>{});
    // #endregion
    const { data: profile, error } = await client
      .from('profiles')
      .select('id, email, credits, is_admin')
      .eq('id', user.id)
      .single();

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:getProfile',message:'profiles query returned',data:{hasProfile:!!profile,hasError:!!error,errorMsg:error?.message?.slice(0,100)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2,H3,H5'})}).catch(()=>{});
    // #endregion
    if (error) return { data: null, error: error as unknown as Error };
    if (!profile) return { data: null, error: null };
    return { data: rowToProfile(profile), error: null };
  },

  async updateCredits(newCredits: number): Promise<{ error: Error | null }> {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { error: new Error('Not authenticated') };

    const { data: profile } = await client
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    const previousCredits = profile?.credits ?? 0;
    const delta = newCredits - previousCredits;

    const { error: updateError } = await client
      .from('profiles')
      .update({ credits: newCredits, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) return { error: updateError as unknown as Error };

    if (delta !== 0) {
      await client.from('credit_transactions').insert({
        user_id: user.id,
        amount: delta,
      });
    }
    return { error: null };
  },

  async signOut(): Promise<void> {
    await client.auth.signOut();
  },

  /** Subscribe to auth state changes; callback receives UserProfile | null */
  onAuthStateChange(callback: (profile: UserProfile | null) => void): () => void {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:onAuthStateChange',message:'onAuthStateChange setup',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:onAuthStateChange',message:'auth state changed',data:{event:_event,hasSession:!!session,hasUser:!!session?.user,userId:session?.user?.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      if (!session?.user) {
        callback(null);
        return;
      }
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:onAuthStateChange',message:'calling getProfile',data:{userId:session.user.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2,H3,H5'})}).catch(()=>{});
      // #endregion
      try {
        // Agregar timeout a getProfile para evitar carga infinita
        const profilePromise = supabaseService.getProfile();
        const timeoutPromise = new Promise<{ data: UserProfile | null; error: Error | null }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error('Timeout al obtener perfil') }), 10000)
        );
        
        const { data, error } = await Promise.race([profilePromise, timeoutPromise]);
        
        if (error) {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:onAuthStateChange',message:'getProfile error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2,H3,H5'})}).catch(()=>{});
          // #endregion
          // No actualizar estado si hay error, mantener estado anterior
          console.warn('Error al obtener perfil:', error.message);
          return;
        }
        
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:onAuthStateChange',message:'getProfile returned',data:{hasData:!!data,hasError:false},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2,H3,H5'})}).catch(()=>{});
        // #endregion
        callback(data ?? null);
      } catch (err) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/45c51b0e-4459-4f93-b2c0-30a1e2f81e2e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:onAuthStateChange',message:'getProfile exception',data:{error:err instanceof Error ? err.message : String(err)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2,H3,H5'})}).catch(()=>{});
        // #endregion
        console.error('Excepción al obtener perfil:', err);
        // No actualizar estado si hay excepción
      }
    });
    return () => subscription.unsubscribe();
  },
};

/** App-facing API (same interface as before). Use supabase.getProducts(), supabase.signIn(), etc. */
export const supabase = supabaseService;

/** Raw Supabase client for advanced use (e.g. realtime). */
export const supabaseClient = client;
