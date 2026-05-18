import { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Music, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ merch: 0, shows: 0, tracks: 0, gallery: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [merchRes, showsRes, tracksRes, galleryRes] = await Promise.all([
          api.get('/merch').catch(() => ({ data: [] })),
          api.get('/shows').catch(() => ({ data: [] })),
          api.get('/albums').catch(() => ({ data: [] })),
          api.get('/gallery').catch(() => ({ data: [] })),
        ]);
        setStats({
          merch: merchRes.data.length || 0,
          shows: showsRes.data.length || 0,
          tracks: tracksRes.data.length || 0,
          gallery: galleryRes.data.length || 0,
        });
      } catch (error) {
        console.error('Failed to load stats', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Merch',    value: stats.merch,   icon: <ShoppingBag size={22} />, num: '01' },
    { name: 'Upcoming Shows', value: stats.shows,   icon: <Calendar size={22} />,    num: '02' },
    { name: 'Albums',         value: stats.tracks,  icon: <Music size={22} />,       num: '03' },
    { name: 'Gallery Items',  value: stats.gallery, icon: <ImageIcon size={22} />,   num: '04' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2
          className="text-[#F0EBE0] leading-none"
          style={{ fontFamily: '"Drowner Free", serif', fontSize: '3.5rem' }}
        >
          Good day.
        </h2>
        <p className="font-mono text-sm text-[#8FA9C4] mt-2">
          Here's what's on the desk today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-[#04060A] border border-[#3A609E] p-6 hover:border-[#8FA9C4] transition-colors"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8FA9C4]">
                // {stat.num}
              </span>
              <div className="text-[#3A609E]">{stat.icon}</div>
            </div>
            <h3
              className="text-[#F0EBE0] leading-none"
              style={{ fontFamily: '"Drowner Free", serif', fontSize: '3.5rem' }}
            >
              {stat.value}
            </h3>
            <p className="font-mono text-sm text-[#8FA9C4] mt-3">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#04060A] border border-[#3A609E] p-8">
        <span className="section-label">// Quick note</span>
        <h3
          className="text-[#F0EBE0] mt-3 mb-2"
          style={{ fontFamily: '"Drowner Free", serif', fontSize: '2rem' }}
        >
          Pick a section from the sidebar to start editing.
        </h3>
        <p className="font-mono text-sm text-[#8FA9C4]">
          Everything you publish here shows up on the public site right away.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
