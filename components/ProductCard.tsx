import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Edit, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onAddToCart: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isAdmin, 
  onAddToCart, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.image || 'https://picsum.photos/400/400'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm">
          {product.category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-primary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          {!isAdmin ? (
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors active:scale-95"
            >
              <ShoppingBag size={18} />
              Comprar
            </button>
          ) : (
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => onEdit(product)}
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <Edit size={16} /> Edit
              </button>
              <button 
                onClick={() => onDelete(product.id)}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border border-red-200"
              >
                <Trash2 size={16} /> Del
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};