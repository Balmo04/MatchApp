
export enum Category {
  SHIRTS = 'Shirts',
  PANTS = 'Pants',
  SHOES = 'Shoes',
  JACKETS = 'Jackets',
  ACCESSORIES = 'Accessories'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  imageUrl: string;
  promptFragment: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  credits: number;
  isAdmin: boolean;
}

export enum Step {
  UPLOAD = 'upload',
  BROWSE = 'browse',
  TRYON = 'tryon'
}

export interface TryOnResult {
  originalImage: string;
  generatedImage: string;
  selectedProducts: Product[];
}
