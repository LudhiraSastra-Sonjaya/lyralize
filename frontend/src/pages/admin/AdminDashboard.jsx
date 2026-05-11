import { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Music, ImageIcon, Users } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    merch: 0,
    shows: 0,
    tracks: 0,
    gallery: 0
  });

  useEffect(() => {
    // In a real app, you might have a dedicated /api/stats endpoint.
    // For now we'll just fetch a few collections to get lengths if available.
    const fetchStats = async () => {
      try {
        const [merchRes, showsRes] = await Promise.all([
          api.get('/merch').catch(() => ({ data: [] })),
          api.get('/shows').catch(() => ({ data: [] }))
        ]);
        
        setStats({
          merch: merchRes.data.length || 0,
          shows: showsRes.data.length || 0,
          tracks: 0,
          gallery: 0
        });
      } catch (error) {
        console.error('Failed to load stats', error);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Merch', value: stats.merch, icon: <ShoppingBag size={24} />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Upcoming Shows', value: stats.shows, icon: <Calendar size={24} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Tracks', value: stats.tracks, icon: <Music size={24} />, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { name: 'Gallery Items', value: stats.gallery, icon: <ImageIcon size={24} />, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[#0F0F1A] border border-white/5 rounded-xl p-6 flex items-center gap-4 hover:border-white/10 transition-colors">
            <div className={`p-4 rounded-lg ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
              <h3 className="text-2xl font-display font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0F0F1A] border border-white/5 rounded-xl p-6">
        <h3 className="text-xl font-display font-bold text-white mb-4">Welcome back!</h3>
        <p className="text-gray-400">
          Select an item from the sidebar to start managing your site's content.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
