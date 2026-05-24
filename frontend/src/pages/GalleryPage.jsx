import Gallery from '../components/Gallery';
import { useEffect } from 'react';

const GalleryPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#04060A]">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-40 md:pt-48 pb-16">
        <div className="flex items-center gap-6 mb-10">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">// 04</span>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">Photographs</span>
          <div className="flex-1 h-px bg-[#3A609E]" />
          <span className="hidden md:block font-mono text-sm text-[#3A609E] select-none">写真</span>
        </div>
        <h1 className="cs-hero text-[#F0EBE0] leading-[0.9]">Frames.</h1>
        <p className="mt-8 max-w-2xl font-mono text-sm md:text-base text-[#8FA9C4] leading-relaxed">
          Blurred, overexposed, and slightly out of focus — just like
          the music. Scroll to move through it.
        </p>
      </div>
      <Gallery />
    </div>
  );
};

export default GalleryPage;
