import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    order: 0,
    type: 'image'
  });

  const fetchGallery = async () => {
    try {
      const response = await api.get('/gallery');
      setGallery(response.data);
    } catch (error) {
      console.error('Failed to fetch gallery', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title || '');
    data.append('order', formData.order || 0);
    data.append('type', formData.type);

    if (formData.image instanceof File) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        data.append('_method', 'PUT');
        await api.post(`/gallery/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/gallery', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchGallery();
    } catch (error) {
      console.error('Failed to save gallery item', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/gallery/${id}`);
        fetchGallery();
      } catch (error) {
        console.error('Failed to delete gallery item', error);
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title || '',
        image: null,
        order: item.order || 0,
        type: item.type || 'image'
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        image: null,
        order: 0,
        type: 'image'
      });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-white">Gallery</h1>
        <button
          onClick={() => openModal()}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <div className="bg-[#0F0F1A] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {gallery.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <img src={item.image_url} alt={item.title || 'Gallery Image'} className="w-16 h-12 rounded object-cover" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{item.title || '-'}</div>
                </td>
                <td className="px-6 py-4 capitalize">{item.type}</td>
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
            {gallery.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No gallery items found. Add some!
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
                {editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title (Optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Image/Video File</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8B5CF6]/20 file:text-[#8B5CF6] hover:file:bg-[#8B5CF6]/30"
                />
                {editingId && !formData.image && <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing media.</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Order Index</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                  />
                </div>
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

export default AdminGallery;
