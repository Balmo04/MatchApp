
import { Category, Product } from './types';

export const INITIAL_CREDITS = 5;
export const MAX_SELECTIONS = 4;
export const CREDIT_PACKS = [
  { id: 'small', amount: 10, price: 9.99 },
  { id: 'medium', amount: 25, price: 19.99 },
  { id: 'large', amount: 60, price: 39.99 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Silk Evening Shirt',
    category: Category.SHIRTS,
    price: 240,
    description: 'A luxurious silk shirt with a subtle sheen, perfect for gala events.',
    imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2fcc103e707?auto=format&fit=crop&q=80&w=400',
    promptFragment: 'wearing a slim-fit navy silk button-down shirt with a sophisticated sheen',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Italian Wool Trousers',
    category: Category.PANTS,
    price: 320,
    description: 'Masterfully tailored trousers made from premium Italian wool.',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400',
    promptFragment: 'wearing charcoal grey tailored Italian wool trousers with a sharp crease',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Oxford Leather Brogues',
    category: Category.SHOES,
    price: 450,
    description: 'Handcrafted leather shoes with intricate brogue detailing.',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=400',
    promptFragment: 'wearing polished tan leather Oxford brogues',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Cashmere Overcoat',
    category: Category.JACKETS,
    price: 1200,
    description: 'The pinnacle of luxury outerwear, made from 100% pure cashmere.',
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654ca?auto=format&fit=crop&q=80&w=400',
    promptFragment: 'wearing a long camel-colored pure cashmere overcoat',
    created_at: new Date().toISOString()
  }
];
