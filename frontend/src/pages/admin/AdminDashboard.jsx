import { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Music, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ merch: 0, shows: 0, albums: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [merchRes, showsRes, albumsRes, galleryRes] = await Promise.allSettled([
          api.get('/merch'),
          api.get('/shows'),
          api.get('/albums'),
          api.get('/gallery'),
        ]);

        const safeLength = (result) => {
          if (result.status === 'fulfilled') {
            const data = result.value.data;
            // Handle both array and paginated responses
            if (Array.isArray(data)) return data.length;
            if (data?.data && Array.isArray(data.data)) return data.data.length;
            if (typeof data?.total === 'number') return data.total;
          }
          return 0;
        };

        setStats({
          merch:   safeLength(merchRes),
          shows:   safeLength(showsRes),
          albums:  safeLength(albumsRes),
          gallery: safeLength(galleryRes),
        });
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Merch',    value: stats.merch,   icon: <ShoppingBag size={22} />, num: '01' },
    { name: 'Upcoming Shows', value: stats.shows,   icon: <Calendar size={22} />,    num: '02' },
    { name: 'Albums',         value: stats.albums,  icon: <Music size={22} />,       num: '03' },
    { name: 'Gallery Items',  value: stats.gallery, icon: <ImageIcon size={22} />,   num: '04' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="cs-md text-[#E8EEFF] leading-none">Good day.</h2>
        <p className="font-mono text-sm text-[#5A6080] mt-2">
          Here's what's on the desk today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-[#00010F] border border-[#0A0F2E] p-6 hover:border-[#1400FF] transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="text-[#fdfdfd]">{stat.icon}</div>
            </div>
            <h3 className="cs-md text-[#E8EEFF] leading-none">
              {loading ? '—' : stat.value}
            </h3>
            <p className="font-serif text-lg text-[#5A6080] mt-3">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#00010F] border border-[#0A0F2E] p-8">
        <span className="section-label">// Quick note</span>
        <h3 className="cs-sm text-[#E8EEFF] mt-3 mb-2">
          Pick a section from the sidebar to start editing.
        </h3>
        <p className="font-serif text-lg text-[#5A6080]">
          Everything you publish here shows up on the public site right away.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
