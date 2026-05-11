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
        const response = await api.get('/gallery');
        setImages(response.data);
      } catch (error) {
        console.error('Failed to fetch gallery', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    if (loading || images.length === 0) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        let containerWidth = containerRef.current.scrollWidth;
        return -(containerWidth - window.innerWidth);
      };

      const tween = gsap.to(containerRef.current, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getScrollAmount() * -1}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
      
      // Image Parallax inside Horizontal Scroll
      const imagesArr = gsap.utils.toArray('.gallery-img');
      imagesArr.forEach(img => {
        gsap.to(img, {
          xPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${getScrollAmount() * -1}`,
            scrub: true,
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [loading, images]);

  return (
    <section ref={sectionRef} id="gallery" className="w-full h-screen bg-[#0F172A] overflow-hidden flex items-center relative">
      <div className="absolute top-12 left-6 md:left-12 z-10 mix-blend-difference">
        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase text-white tracking-tighter">Documentation</h2>
      </div>
      
      {loading ? (
        <div className="w-full flex justify-center text-[#8B5CF6] font-display animate-pulse text-xl">Loading Memory...</div>
      ) : images.length === 0 ? (
        <div className="w-full flex justify-center text-gray-500 font-sans tracking-widest uppercase">No photos available.</div>
      ) : (
        <div ref={containerRef} className="flex gap-8 md:gap-16 px-6 md:px-32 w-max items-center h-[60vh]">
          {images.map((imgObj, index) => (
            <div 
              key={imgObj.id} 
              className={`relative overflow-hidden flex-shrink-0 ${index % 2 === 0 ? 'w-[60vw] md:w-[35vw] h-[50vh] md:h-[60vh]' : 'w-[50vw] md:w-[25vw] h-[40vh] md:h-[50vh] mt-24'}`}
            >
              <div className="absolute inset-[-20%] w-[140%] h-full">
                <img 
                  src={imgObj.image_url} 
                  alt={imgObj.caption || `Gallery ${index}`} 
                  className="gallery-img w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Gallery;
