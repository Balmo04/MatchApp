
// NOTE: Since we don't have real Supabase keys, we implement a robust Mock service
// that simulates Supabase behavior for this demonstration.

import { Product, UserProfile, Category } from './types';
import { MOCK_PRODUCTS, INITIAL_CREDITS } from './constants';

class MockSupabase {
  private products: Product[] = [...MOCK_PRODUCTS];
  private profile: UserProfile | null = null;

  async getProducts() {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    return { data: this.products, error: null };
  }

  async uploadProduct(product: Partial<Product>, imageFile: File) {
    // Simulate image upload to storage
    const imageUrl = URL.createObjectURL(imageFile);
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: product.name || '',
      category: product.category || Category.SHIRTS,
      price: product.price || 0,
      description: product.description || '',
      imageUrl: imageUrl,
      promptFragment: product.promptFragment || '',
      created_at: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return { data: newProduct, error: null };
  }

  async signIn(email: string) {
    this.profile = {
      id: 'user_123',
      email,
      credits: INITIAL_CREDITS,
      isAdmin: email.includes('admin')
    };
    return { data: { user: this.profile }, error: null };
  }

  async getProfile() {
    return { data: this.profile, error: null };
  }

  async updateCredits(newCredits: number) {
    if (this.profile) {
      this.profile.credits = newCredits;
    }
    return { error: null };
  }

  async signOut() {
    this.profile = null;
  }
}

export const supabase = new MockSupabase();
