import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, CATEGORIES, Category } from './types';
import { ProductCard } from './components/ProductCard';
import { AdminPanel } from './components/AdminPanel';
import { Cart } from './components/Cart';
import { Shield, ShoppingBag, Menu, X, LogOut, Search } from 'lucide-react';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral Verão',
    price: 129.90,
    category: 'Vestido',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80',
    description: 'Vestido leve com estampa floral, perfeito para dias ensolarados.'
  },
  {
    id: '2',
    name: 'Blusa de Seda Branca',
    price: 89.90,
    category: 'Blusa',
    image: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=500&q=80',
    description: 'Elegância e conforto em uma peça versátil.'
  },
  {
    id: '3',
    name: 'Bolsa de Couro Rosa',
    price: 199.90,
    category: 'Bolsas',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80',
    description: 'Acessório indispensável para compor seu look.'
  }
];

export default function App() {
  // State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('paty_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('paty_products', JSON.stringify(products));
  }, [products]);

  // Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, product]);
    }
    setShowAdminPanel(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAdminPanel(true);
  };

  const filteredProducts = useMemo(() => {
    return selectedCategory === 'Todos' 
      ? products 
      : products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ShoppingBag className="text-primary h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Paty Modas
              </h1>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isAdminMode ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Shield size={16} />
                {isAdminMode ? 'Modo Admin' : 'Admin'}
              </button>

              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-500 hover:text-primary transition-colors"
              >
                <ShoppingBag size={24} />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setShowCart(true)} className="relative text-gray-500">
                 <ShoppingBag size={24} />
                  {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
            <button 
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-700">Modo Administrador</span>
              <Shield size={16} className={isAdminMode ? 'text-purple-600' : 'text-gray-400'} />
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Admin Header */}
        {isAdminMode && (
          <div className="mb-8 bg-purple-50 border border-purple-100 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-purple-900">Painel Administrativo</h2>
              <p className="text-purple-600 text-sm">Gerencie o catálogo da loja</p>
            </div>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setShowAdminPanel(true);
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
            >
              + Adicionar Produto
            </button>
          </div>
        )}

        {/* Categories */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => setSelectedCategory('Todos')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === 'Todos' 
                  ? 'bg-gray-900 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Todos
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-pink-200 scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={isAdminMode}
                onAddToCart={handleAddToCart}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente selecionar outra categoria ou adicione produtos no modo Admin.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2024 Paty Modas. Todos os direitos reservados.</p>
          <p className="text-gray-400 text-xs mt-2">Desenvolvido com carinho.</p>
        </div>
      </footer>

      {/* Modals & Sidebars */}
      <Cart 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        items={cart} 
        onRemove={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQty}
      />

      {showAdminPanel && (
        <AdminPanel 
          onSave={handleSaveProduct} 
          onCancel={() => {
            setShowAdminPanel(false);
            setEditingProduct(null);
          }}
          editingProduct={editingProduct}
          products={products}
        />
      )}
    </div>
  );
}