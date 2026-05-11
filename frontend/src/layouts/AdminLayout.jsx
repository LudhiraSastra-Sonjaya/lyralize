import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Calendar, Image as ImageIcon, Music, Users, MessageSquare, LogOut, Disc3 } from 'lucide-react';
import api from '../services/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      navigate('/admin/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Albums', path: '/admin/albums', icon: <Disc3 size={20} /> },
    { name: 'Tracks', path: '/admin/tracks', icon: <Music size={20} /> },
    { name: 'Shows', path: '/admin/shows', icon: <Calendar size={20} /> },
    { name: 'Merch', path: '/admin/merch', icon: <ShoppingBag size={20} /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
    { name: 'Band Profile', path: '/admin/band-profile', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#050508] text-[#E2E8F0] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F0F1A] border-r border-white/5 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link to="/admin" className="text-xl font-display font-bold tracking-tighter uppercase text-[#8B5CF6]">
            Lanterne Admin
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
                
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-[#050508]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-medium text-gray-200 capitalize">
            {location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <Link to="/" target="_blank" className="text-sm text-gray-400 hover:text-white transition-colors">
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
