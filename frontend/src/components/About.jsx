import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal on scroll
      gsap.fromTo(
        '.reveal-text',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
          },
        }
      );

      // Image Parallax
      gsap.fromTo(
        imageRef.current,
        { y: 100 },
        {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen py-24 md:py-40 bg-[#050816] flex items-center"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Asymmetrical Image Composition */}
          <div className="md:col-span-5 relative h-[60vh] md:h-[80vh] overflow-hidden">
            <div 
              ref={imageRef}
              className="absolute inset-[-10%] w-[120%] h-[120%] bg-[url('https://images.unsplash.com/photo-1516280440503-62f8087961b5?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-luminosity grayscale"
            />
          </div>

          {/* Text Content */}
          <div ref={textRef} className="md:col-span-6 md:col-start-7 flex flex-col justify-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-8 reveal-text">
              Forging new <span className="text-[#3B82F6]">sonic</span> architectures.
            </h2>
            
            <div className="space-y-6 text-gray-400 font-light text-lg md:text-xl leading-relaxed">
              <p className="reveal-text">
                Lanterne is not just a collective; it is an exploration of the spaces between sound and silence. Formed in 2024, our work draws inspiration from brutalist architecture—finding beauty in raw, uncompromising textures.
              </p>
              <p className="reveal-text">
                We believe in an immersive digital and auditory experience. Each composition is designed like a structure: a foundation of deep rhythms, pillars of atmospheric synths, and intricate melodic facades.
              </p>
            </div>
            
            <div className="mt-12 reveal-text">
              <a href="#releases" className="inline-block border border-gray-600 px-8 py-4 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors duration-300">
                Explore Discography
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;
