import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const images = [
  'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a1a2a5f5c937?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516280440503-62f8087961b5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518972553051-7ef118a8b111?q=80&w=800&auto=format&fit=crop'
];

const Gallery = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
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
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="w-full h-screen bg-[#0F172A] overflow-hidden flex items-center">
      <div className="absolute top-12 left-6 md:left-12 z-10 mix-blend-difference">
        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase text-white tracking-tighter">Documentation</h2>
      </div>
      
      <div ref={containerRef} className="flex gap-8 md:gap-16 px-6 md:px-32 w-max items-center h-[60vh]">
        {images.map((src, index) => (
          <div 
            key={index} 
            className={`relative overflow-hidden flex-shrink-0 ${index % 2 === 0 ? 'w-[60vw] md:w-[35vw] h-[50vh] md:h-[60vh]' : 'w-[50vw] md:w-[25vw] h-[40vh] md:h-[50vh] mt-24'}`}
          >
            <div className="absolute inset-[-20%] w-[140%] h-full">
              <img 
                src={src} 
                alt={`Gallery ${index}`} 
                className="gallery-img w-full h-full object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
