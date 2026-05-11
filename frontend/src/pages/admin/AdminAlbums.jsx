import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const AdminAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_date: '',
    cover_image: null,
    purchase_url: '',
    spotify_url: '',
    apple_music_url: ''
  });

  const fetchAlbums = async () => {
    try {
      const response = await api.get('/albums');
      setAlbums(response.data);
    } catch (error) {
      console.error('Failed to fetch albums', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description || '');
    data.append('release_date', formData.release_date || '');
    data.append('purchase_url', formData.purchase_url || '');
    data.append('spotify_url', formData.spotify_url || '');
    data.append('apple_music_url', formData.apple_music_url || '');
    
    if (formData.cover_image instanceof File) {
      data.append('cover_image', formData.cover_image);
    }

    try {
      if (editingId) {
        data.append('_method', 'PUT');
        await api.post(`/albums/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/albums', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchAlbums();
    } catch (error) {
      console.error('Failed to save album', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        await api.delete(`/albums/${id}`);
        fetchAlbums();
      } catch (error) {
        console.error('Failed to delete album', error);
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        description: item.description || '',
        release_date: item.release_date || '',
        cover_image: null,
        purchase_url: item.purchase_url || '',
        spotify_url: item.spotify_url || '',
        apple_music_url: item.apple_music_url || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        release_date: '',
        cover_image: null,
        purchase_url: '',
        spotify_url: '',
        apple_music_url: ''
      });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-white">Albums</h1>
        <button
          onClick={() => openModal()}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Album
        </button>
      </div>

      <div className="bg-[#0F0F1A] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Cover</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Release Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {albums.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  {item.cover_image_url ? (
                    <img src={item.cover_image_url} alt={item.title} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">N/A</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{item.title}</div>
                </td>
                <td className="px-6 py-4">{item.release_date || '-'}</td>
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
            {albums.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No albums found. Add some!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0F1A] border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
              <h2 className="text-xl font-display font-bold text-white">
                {editingId ? 'Edit Album' : 'Add Album'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="album-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white h-24"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Release Date</label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, cover_image: e.target.files[0]})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8B5CF6]/20 file:text-[#8B5CF6] hover:file:bg-[#8B5CF6]/30"
                  />
                  {editingId && !formData.cover_image && <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing cover.</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Spotify URL</label>
                    <input
                      type="url"
                      value={formData.spotify_url}
                      onChange={(e) => setFormData({...formData, spotify_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Apple Music URL</label>
                    <input
                      type="url"
                      value={formData.apple_music_url}
                      onChange={(e) => setFormData({...formData, apple_music_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Purchase URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.purchase_url}
                    onChange={(e) => setFormData({...formData, purchase_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                  />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/5 shrink-0 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                form="album-form"
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlbums;
