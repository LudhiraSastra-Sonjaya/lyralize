import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="noise-bg" />

      {/* Soft blue glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#8FA9C4]/8 blur-[150px] pointer-events-none" />

      {/* Watermark */}
      <h1
        className="absolute -bottom-8 md:-bottom-16 left-1/2 transform -translate-x-1/2 leading-none text-[#8FA9C4]/[0.05] pointer-events-none select-none whitespace-nowrap"
        style={{ fontFamily: '"Drowner Free", serif', fontSize: 'clamp(8rem, 25vw, 22rem)' }}
      >
        Lyralize
      </h1>

      <div className="w-full max-w-md bg-[#0E1A2F] border border-[#3A609E] p-10 relative z-10 shadow-[0_20px_80px_-20px_rgba(30,63,168,0.15)]">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8FA9C4]">// 00</span>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8FA9C4]">Authentication</span>
          </div>
          <h1
            className="text-[#F0EBE0] leading-none mb-2"
            style={{ fontFamily: '"Drowner Free", serif', fontSize: '3rem' }}
          >
            Control Room.
          </h1>
          <p className="font-mono text-sm text-[#8FA9C4]">
            Sign in to manage the archive.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-sm mb-6 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.3em] uppercase text-[#8FA9C4] mb-2">
              // Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#3A609E] focus:border-[#8FA9C4] outline-none px-0 py-2.5 text-[#F0EBE0] font-mono text-base placeholder-[#8FA9C4]/50 transition-colors"
              placeholder="admin@lyralize.com"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.3em] uppercase text-[#8FA9C4] mb-2">
              // Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-[#3A609E] focus:border-[#8FA9C4] outline-none px-0 py-2.5 text-[#F0EBE0] font-mono text-base placeholder-[#8FA9C4]/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8FA9C4] hover:bg-[#A0C4E2] text-[#04060A] font-mono text-[11px] tracking-[0.3em] uppercase py-4 transition-colors mt-4 disabled:opacity-50 rounded-full"
          >
            {loading ? 'Signing in...' : 'Enter →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
