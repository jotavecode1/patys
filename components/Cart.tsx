import React from 'react';
import { CartItem } from '../types';
import { X, ShoppingBag, Send } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const phoneNumber = "5518981784826";
    let message = "*Olá, Paty Modas! Gostaria de fazer o seguinte pedido:*\n\n";
    
    items.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)}\n`;
    });
    
    message += `\n*Total: R$ ${total.toFixed(2)}*`;
    message += "\n\nAguardo confirmação!";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-pink-50">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <ShoppingBag />
            <span>Seu Carrinho</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <ShoppingBag size={64} opacity={0.2} />
              <p>Seu carrinho está vazio.</p>
              <button onClick={onClose} className="text-primary font-semibold hover:underline">
                Voltar às compras
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <img 
                  src={item.image || 'https://picsum.photos/100/100'} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                    <span className="text-sm text-gray-500">{item.category}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-gray-500 hover:text-primary w-5 text-center"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-gray-500 hover:text-primary w-5 text-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-4 text-lg font-bold text-gray-800">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            >
              <Send size={20} />
              Finalizar no WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};