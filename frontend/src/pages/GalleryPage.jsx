import Gallery from '../components/Gallery';
import { useEffect } from 'react';

const GalleryPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-12 min-h-screen bg-[#0F0F1A]">
      <Gallery />
    </div>
  );
};

export default GalleryPage;
