import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const subTextRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      const tl = gsap.timeline();
      
      tl.fromTo(
        textRef.current.children,
        { y: 150, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
          delay: 0.5,
        }
      )
      .fromTo(
        subTextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        imageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 0.6, duration: 1.5, ease: 'power2.out' },
        '-=1.2'
      );

      // Parallax Scroll Effect
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(textRef.current, {
        yPercent: -50,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#050816]"
    >
      {/* Background Cinematic Image/Video placeholder */}
      <div className="absolute inset-0 z-0">
        <div 
          ref={imageRef}
          className="w-full h-full bg-[url('https://images.unsplash.com/photo-1493225457124-a1a2a5f5c937?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050816]/50 to-[#050816]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 mt-20">
        <h1
          ref={textRef}
          className="text-[14vw] md:text-[12vw] font-distorted font-normal uppercase leading-[0.8] tracking-widest flex overflow-hidden justify-center mix-blend-screen text-[#8B5CF6] blur-[1px] hover:blur-0 transition-all duration-700"
        >
          <span className="block">L</span>
          <span className="block">A</span>
          <span className="block">N</span>
          <span className="block">T</span>
          <span className="block">E</span>
          <span className="block">R</span>
          <span className="block">N</span>
          <span className="block">E</span>
        </h1>
        
        <p
          ref={subTextRef}
          className="mt-8 text-sm md:text-lg tracking-[0.4em] uppercase text-gray-300 font-display blur-[0.5px]"
        >
          Cinematic Soundscape Collective
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 mix-blend-screen">
        <span className="text-xs tracking-[0.2em] uppercase text-[#8B5CF6]/70 font-display">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-[#8B5CF6]/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#8B5CF6] animate-[scroll_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
