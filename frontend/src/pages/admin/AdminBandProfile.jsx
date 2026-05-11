import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminBandProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    hero_video_file: null,
    contact_email: '',
    phone: '',
    location: '',
    instagram_url: '',
    twitter_url: '',
    youtube_url: '',
    spotify_url: ''
  });

  const fetchProfile = async () => {
    try {
      const response = await api.get('/band-profile');
      if (response.data) {
        setFormData({
          name: response.data.name || '',
          bio: response.data.bio || '',
          hero_video_file: null,
          contact_email: response.data.contact_email || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          instagram_url: response.data.instagram_url || '',
          twitter_url: response.data.twitter_url || '',
          youtube_url: response.data.youtube_url || '',
          spotify_url: response.data.spotify_url || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch band profile', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio || '');
    data.append('contact_email', formData.contact_email || '');
    data.append('phone', formData.phone || '');
    data.append('location', formData.location || '');
    data.append('instagram_url', formData.instagram_url || '');
    data.append('twitter_url', formData.twitter_url || '');
    data.append('youtube_url', formData.youtube_url || '');
    data.append('spotify_url', formData.spotify_url || '');

    if (formData.hero_video_file instanceof File) {
      data.append('hero_video_file', formData.hero_video_file);
    }
    
    try {
      await api.post('/band-profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Failed to save profile', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold text-white">Band Profile</h1>
      </div>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#0F0F1A] border border-white/5 rounded-xl p-8 space-y-8">
        
        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4 border-b border-white/5 pb-2">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Band Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Biography</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white min-h-[150px]"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Hero Image/Video (Background for Home)</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFormData({...formData, hero_video_file: e.target.files[0]})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8B5CF6]/20 file:text-[#8B5CF6] hover:file:bg-[#8B5CF6]/30"
              />
              {!formData.hero_video_file && <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing media.</p>}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4 border-b border-white/5 pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4 border-b border-white/5 pb-2">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Twitter URL</label>
              <input
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({...formData, twitter_url: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">YouTube URL</label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Spotify URL</label>
              <input
                type="url"
                value={formData.spotify_url}
                onChange={(e) => setFormData({...formData, spotify_url: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBandProfile;
