import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const AdminMerch = () => {
  const [merch, setMerch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: 'clothing',
    in_stock: true,
    ecommerce_link: ''
  });

  const fetchMerch = async () => {
    try {
      const response = await api.get('/merch');
      setMerch(response.data);
    } catch (error) {
      console.error('Failed to fetch merch', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description || '');
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('ecommerce_link', formData.ecommerce_link || '#');
    data.append('in_stock', formData.in_stock ? 1 : 0);

    if (formData.image instanceof File) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        data.append('_method', 'PUT');
        await api.post(`/merch/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/merch', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchMerch();
    } catch (error) {
      console.error('Failed to save merch', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/merch/${id}`);
        fetchMerch();
      } catch (error) {
        console.error('Failed to delete merch', error);
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price,
        image: null,
        category: item.category || 'clothing',
        in_stock: item.in_stock !== false,
        ecommerce_link: item.ecommerce_link || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null,
        category: 'clothing',
        in_stock: true,
        ecommerce_link: ''
      });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-white">Merchandise</h1>
        <button
          onClick={() => openModal()}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Merch
        </button>
      </div>

      <div className="bg-[#0F0F1A] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Item</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {merch.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{item.category}</div>
                </td>
                <td className="px-6 py-4">${parseFloat(item.price).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${item.in_stock ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {item.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(item)} className="text-blue-400 hover:text-blue-300 p-2">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 p-2">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {merch.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No merchandise found. Add some!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F1A] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-xl font-display font-bold text-white">
                {editingId ? 'Edit Merch' : 'Add Merch'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8B5CF6]/20 file:text-[#8B5CF6] hover:file:bg-[#8B5CF6]/30"
                />
                {editingId && !formData.image && <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing image.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">E-commerce Link (Tokopedia/Shopee)</label>
                <input
                  type="url"
                  value={formData.ecommerce_link}
                  onChange={(e) => setFormData({...formData, ecommerce_link: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="in_stock"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                  className="rounded bg-white/5 border-white/10 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <label htmlFor="in_stock" className="text-sm text-gray-300">In Stock</label>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMerch;
