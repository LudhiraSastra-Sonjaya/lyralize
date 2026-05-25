import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../../services/api';

const ProtectedRoute = () => {
  const [authState, setAuthState] = useState('checking'); // 'checking' | 'ok' | 'fail'

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAuthState('fail');
      return;
    }

    // Set a timeout for verification (5 seconds)
    const timeoutId = setTimeout(() => {
      console.error('Session verification timeout - backend may not be responding');
      localStorage.removeItem('token');
      setAuthState('fail');
    }, 5000);

    // Validate the token against the backend
    api.get('/user')
      .then(() => {
        clearTimeout(timeoutId);
        setAuthState('ok');
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error('Session verification failed:', error.message);
        // Token is invalid or expired — clear it
        localStorage.removeItem('token');
        setAuthState('fail');
      });

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []);

  if (authState === 'checking') {
    // Show a minimal loading screen while validating
    return (
      <div className="min-h-screen bg-[#00010F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#1400FF] border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#5A6080]">
            Verifying session...
          </span>
        </div>
      </div>
    );
  }

  if (authState === 'fail') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
