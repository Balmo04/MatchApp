import { createClient } from '@supabase/supabase-js';
import { Product, UserProfile, Category } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Configure .env.local.');
}

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
    const ext = imageFile.name.split('.').pop() || 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await client.storage
      .from(BUCKET_PRODUCT_IMAGES)
      .upload(path, imageFile, { upsert: true });

    if (uploadError) return { data: null, error: uploadError as unknown as Error };

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

    if (error) return { data: null, error: error as unknown as Error };
    return { data: rowToProduct(row), error: null };
  },

  async signIn(
    email: string,
    password: string
  ): Promise<{ data: { user: UserProfile } | null; error: Error | null }> {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'signIn entry',data:{email,hasClient:!!client,hasAuth:!!client?.auth},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'calling signInWithPassword',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email,
      password,
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'signInWithPassword returned',data:{hasData:!!authData,hasError:!!authError},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    if (authError) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'auth failed',data:{msg:authError.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return { data: null, error: authError as unknown as Error };
    }
    if (!authData.user) return { data: null, error: new Error('No user') };
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'auth ok, querying profiles',data:{userId:authData.user.id},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('id, email, credits, is_admin')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ecaa6040-b8f8-4f67-a62e-e3d95ab9e53c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'supabaseClient.ts:signIn',message:'profile query failed',data:{msg:profileError?.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return {
        data: null,
        error: (profileError as Error) ?? new Error('Profile not found'),
      };
    }
    return { data: { user: rowToProfile(profile) }, error: null };
  },

  async signUp(
    email: string,
    password: string
  ): Promise<{ data: { user: UserProfile } | null; error: Error | null }> {
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
    });
    if (authError) return { data: null, error: authError as unknown as Error };
    if (!authData.user) return { data: null, error: new Error('No user') };

    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('id, email, credits, is_admin')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return {
        data: null,
        error: (profileError as Error) ?? new Error('Profile not found'),
      };
    }
    return { data: { user: rowToProfile(profile) }, error: null };
  },

  async getProfile(): Promise<{ data: UserProfile | null; error: Error | null }> {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { data: null, error: null };

    const { data: profile, error } = await client
      .from('profiles')
      .select('id, email, credits, is_admin')
      .eq('id', user.id)
      .single();

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
    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }
      const { data } = await supabaseService.getProfile();
      callback(data ?? null);
    });
    return () => subscription.unsubscribe();
  },
};

/** App-facing API (same interface as before). Use supabase.getProducts(), supabase.signIn(), etc. */
export const supabase = supabaseService;

/** Raw Supabase client for advanced use (e.g. realtime). */
export const supabaseClient = client;
