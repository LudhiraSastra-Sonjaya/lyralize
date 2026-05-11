import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    date: '',
    venue: '',
    location: '',
    ticket_link: ''
  });

  const fetchShows = async () => {
    try {
      const response = await api.get('/shows');
      setShows(response.data);
    } catch (error) {
      console.error('Failed to fetch shows', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/shows/${editingId}`, formData);
      } else {
        await api.post('/shows', formData);
      }
      setIsModalOpen(false);
      fetchShows();
    } catch (error) {
      console.error('Failed to save show', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        await api.delete(`/shows/${id}`);
        fetchShows();
      } catch (error) {
        console.error('Failed to delete show', error);
      }
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      // Backend expects 'date', 'venue', 'location', 'ticket_link'
      setFormData({
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : '', // Format for date input
        venue: item.venue || '',
        location: item.location || '',
        ticket_link: item.ticket_link || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        date: '',
        venue: '',
        location: '',
        ticket_link: ''
      });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-white">Live Shows</h1>
        <button
          onClick={() => openModal()}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Show
        </button>
      </div>

      <div className="bg-[#0F0F1A] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Venue</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {shows.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4">{item.venue}</td>
                <td className="px-6 py-4">{item.location}</td>
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
            {shows.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No shows found. Add some!
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
                {editingId ? 'Edit Show' : 'Add Show'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Venue</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Location (City, Country)</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ticket Link (Optional)</label>
                <input
                  type="url"
                  value={formData.ticket_link}
                  onChange={(e) => setFormData({...formData, ticket_link: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
                />
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

export default AdminShows;
