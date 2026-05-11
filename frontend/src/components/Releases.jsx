import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const albums = [
  { title: 'Ethereal Echoes', year: '2023', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop', type: 'LP' },
  { title: 'Static Void', year: '2022', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop', type: 'EP' },
  { title: 'Neon Shadows', year: '2021', image: 'https://images.unsplash.com/photo-1518972553051-7ef118a8b111?q=80&w=800&auto=format&fit=crop', type: 'LP' },
  { title: 'Faded Memories', year: '2020', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop', type: 'EP' },
  { title: 'Reverb Dreams', year: '2019', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop', type: 'LP' },
  { title: 'White Noise', year: '2018', image: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5c937?q=80&w=800&auto=format&fit=crop', type: 'LP' },
];

const Releases = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for cards
      gsap.fromTo(
        cardsRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="releases"
      ref={sectionRef}
      className="w-full py-24 md:py-40 bg-[#0F172A] relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
          <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tighter mix-blend-difference text-white/90">
            Selected <br /> Works
          </h2>
          <p className="text-gray-400 mt-6 md:mt-0 max-w-sm text-sm uppercase tracking-widest text-right">
            Immersive soundscapes designed for modern spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {albums.map((album, index) => (
            <div
              key={album.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden mb-6 bg-[#050816]">
                <img
                  src={album.image}
                  alt={album.title}
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
                
                {/* Vinyl overlay effect */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                <h3 className="text-xl md:text-2xl font-display font-medium uppercase tracking-tight group-hover:text-[#3B82F6] transition-colors duration-300">
                  {album.title}
                </h3>
                <span className="text-sm text-gray-500 tracking-widest">{album.year}</span>
              </div>
              <p className="text-xs text-gray-400 tracking-widest uppercase mt-4">
                {album.type}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Releases;
