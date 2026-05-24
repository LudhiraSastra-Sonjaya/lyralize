import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Calendar, Image as ImageIcon,
  Music, Users, MessageSquare, LogOut, Disc3, Menu, X
} from 'lucide-react';
import api from '../services/api';

const navItems = [
  { name: 'Dashboard',    path: '/admin',             icon: <LayoutDashboard size={18} />, exact: true, num: '01' },
  { name: 'Albums',       path: '/admin/albums',       icon: <Disc3 size={18} />,           num: '02' },
  { name: 'Tracks',       path: '/admin/tracks',       icon: <Music size={18} />,           num: '03' },
  { name: 'Shows',        path: '/admin/shows',        icon: <Calendar size={18} />,        num: '04' },
  { name: 'Merch',        path: '/admin/merch',        icon: <ShoppingBag size={18} />,     num: '05' },
  { name: 'Gallery',      path: '/admin/gallery',      icon: <ImageIcon size={18} />,       num: '06' },
  { name: 'Messages',     path: '/admin/messages',     icon: <MessageSquare size={18} />,   num: '07' },
  { name: 'Band Profile', path: '/admin/band-profile', icon: <Users size={18} />,           num: '08' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (e) { console.error(e); }
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const currentPage = location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard';

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 md:h-20 flex items-center px-6 border-b border-[#3A609E] shrink-0">
        <Link to="/admin" className="flex flex-col leading-none" onClick={() => setSidebarOpen(false)}>
          <span className="text-[#F0EBE0]" style={{ fontFamily: '"Drowner Free", serif', fontSize: '1.5rem' }}>
            Lyralize
          </span>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#8FA9C4] mt-0.5">
            Control Room
          </span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-0.5 px-3">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#8FA9C4]/10 text-[#8FA9C4] border-l-2 border-[#8FA9C4]'
                    : 'text-[#8FA9C4] hover:text-[#F0EBE0] hover:bg-[#F0EBE0]/5'
                }`}
              >
                <span className="font-mono text-[9px] opacity-40 shrink-0">// {item.num}</span>
                <span className="shrink-0">{item.icon}</span>
                <span className="font-mono text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-[#3A609E] shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded text-[#8FA9C4] hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-mono text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#04060A] text-[#F0EBE0] overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-64 bg-[#0E1A2F] border-r border-[#3A609E] flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#F0EBE0]/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#0E1A2F] border-r border-[#3A609E] flex flex-col transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-4 right-4">
          <button onClick={() => setSidebarOpen(false)} className="text-[#8FA9C4] hover:text-[#F0EBE0] p-1">
            <X size={20} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="h-16 md:h-20 bg-[#04060A] border-b border-[#3A609E] flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#8FA9C4] hover:text-[#F0EBE0] p-1 shrink-0"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8FA9C4]">// Admin</span>
              <h2
                className="text-[#F0EBE0] capitalize leading-none mt-0.5 truncate"
                style={{ fontFamily: '"Drowner Free", serif', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}
              >
                {currentPage}
              </h2>
            </div>
          </div>
          <Link
            to="/"
            target="_blank"
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8FA9C4] hover:text-[#8FA9C4] transition-colors shrink-0 ml-4"
          >
            View Site ↗
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0E1A2F]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
