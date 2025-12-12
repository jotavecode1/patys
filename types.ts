export type Category = 
  | 'Vestido' 
  | 'Blusa' 
  | 'Calça' 
  | 'Shorts' 
  | 'Conjuntos' 
  | 'Saias' 
  | 'Bolsas' 
  | 'Oculos'
  | 'Todos';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export const CATEGORIES: Category[] = [
  'Vestido', 'Blusa', 'Calça', 'Shorts', 'Conjuntos', 'Saias', 'Bolsas', 'Oculos'
];