import React, { useState, useEffect } from 'react';
import { Product, CATEGORIES, Category } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Plus, Wand2, X, Upload } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  onSave: (product: Product) => void;
  onCancel: () => void;
  editingProduct?: Product | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSave, onCancel, editingProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('Vestido');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setCategory(editingProduct.category);
      setImage(editingProduct.image);
      setDescription(editingProduct.description);
    }
  }, [editingProduct]);

  const handleGenerateDescription = async () => {
    if (!name) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(name, category);
    setDescription(desc);
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editingProduct ? editingProduct.id : crypto.randomUUID(),
      name,
      price: parseFloat(price),
      category,
      image,
      description
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-pink-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">
            {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Peça</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Ex: Vestido Longo Floral"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input 
                type="number" 
                required
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-24 hover:bg-gray-50 transition-colors">
                 <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                 {image ? (
                   <img src={image} alt="Preview" className="h-full w-full object-contain p-1" />
                 ) : (
                   <div className="flex flex-col items-center text-gray-400">
                     <Upload size={20} />
                     <span className="text-xs mt-1">Carregar Foto</span>
                   </div>
                 )}
              </label>
              <button 
                type="button" 
                onClick={() => setImage('')}
                className="text-sm text-red-500 hover:text-red-700 underline"
                disabled={!image}
              >
                Remover
              </button>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-medium text-gray-700">Descrição</label>
               <button 
                type="button" 
                onClick={handleGenerateDescription}
                disabled={isGenerating || !name}
                className="text-xs flex items-center gap-1 text-primary hover:text-pink-700 disabled:opacity-50"
               >
                 <Wand2 size={12} />
                 {isGenerating ? 'Gerando...' : 'Gerar com IA'}
               </button>
             </div>
             <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               rows={3}
               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none resize-none"
               placeholder="Detalhes sobre tecido, caimento..."
             />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors mt-4 flex items-center justify-center gap-2"
          >
            {editingProduct ? 'Salvar Alterações' : 'Adicionar ao Catálogo'}
            {!editingProduct && <Plus size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};