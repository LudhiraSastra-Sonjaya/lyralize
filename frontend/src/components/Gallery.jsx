import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        setImages(res.data);
      } catch (e) {
        console.error('Failed to fetch gallery', e);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    if (loading || images.length === 0) return;
    const ctx = gsap.context(() => {
      const getScrollAmount = () => -(containerRef.current.scrollWidth - window.innerWidth);
      gsap.to(containerRef.current, {
        x: getScrollAmount, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current, start: 'top top',
          end: () => `+=${getScrollAmount() * -1}`,
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, images]);

  return (
    <section ref={sectionRef} id="gallery" className="w-full h-screen bg-[#F0EBE0] overflow-hidden flex items-center relative">
      {/* Header */}
      <div className="absolute top-10 md:top-14 left-8 md:left-16 z-10">
        <div className="flex items-center gap-6 mb-4">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#1E3FA8]">// 05</span>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#4A6090]">Field Notes</span>
        </div>
        <h2 className="cs-md text-[#0C1B4D] leading-none">
          On the <span className="text-[#1E3FA8]">road</span>.
        </h2>
      </div>

      <div className="absolute bottom-10 right-8 md:right-16 z-10 font-mono text-[10px] tracking-[0.25em] uppercase text-[#4A6090]">
        ← Scroll horizontally
      </div>

      {loading ? (
        <div className="w-full flex justify-center text-[#1E3FA8] font-mono text-sm animate-pulse tracking-widest uppercase">
          Loading memory...
        </div>
      ) : images.length === 0 ? (
        <div className="w-full flex justify-center text-[#4A6090] font-mono tracking-widest uppercase text-sm">
          No photos available.
        </div>
      ) : (
        <div ref={containerRef} className="flex gap-8 md:gap-12 px-8 md:px-32 w-max items-center h-[70vh] mt-20">
          {images.map((imgObj, index) => {
            const isTall = index % 3 !== 1;
            const mt = index % 3 === 1 ? 'mt-24' : '';
            return (
              <figure key={imgObj.id}
                className={`relative shrink-0 bg-[#E2DBC8] border border-[#C8C0A8] overflow-hidden group ${mt}`}
                style={{ width: isTall ? 'clamp(280px, 28vw, 400px)' : 'clamp(340px, 34vw, 520px)' }}
              >
                <div className="relative overflow-hidden scanlines"
                  style={{ height: isTall ? 'clamp(340px, 38vw, 500px)' : 'clamp(240px, 26vw, 340px)' }}
                >
                  <img src={imgObj.image_url} alt={imgObj.caption || `Frame ${index}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ filter: 'grayscale(0.4) brightness(0.75) contrast(1.1)' }}
                  />
                  <div className="absolute inset-0 bg-[#1E3FA8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <figcaption className="font-mono text-sm text-[#0C1B4D] leading-none">
                    {imgObj.caption || `Frame ${String(index + 1).padStart(2, '0')}`}
                  </figcaption>
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#1E3FA8]">
                    // {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </figure>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Gallery;
