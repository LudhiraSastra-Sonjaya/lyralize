import Releases from '../components/Releases';
import { useEffect } from 'react';

const ReleasesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-distorted text-[#8B5CF6] opacity-80 uppercase blur-[1px]">DISCOGRAPHY</h1>
      </div>
      <Releases />
    </div>
  );
};

export default ReleasesPage;
