import Shows from '../components/Shows';
import { useEffect } from 'react';

const ShowsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-[#050508]">
      <div className="text-center mb-12 px-6">
        <h1 className="text-6xl md:text-8xl font-distorted text-white/50 uppercase tracking-widest blur-[2px]">LIVE RITUALS</h1>
      </div>
      <Shows />
    </div>
  );
};

export default ShowsPage;
