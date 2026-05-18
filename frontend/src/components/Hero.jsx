import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const imageRef = useRef(null);
  const metaRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/band-profile');
        setProfile(res.data);
      } catch (e) {
        console.error('Failed to fetch band profile', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo(headlineRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, delay: 0.2 })
        .fromTo(subRef.current?.children || [], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, '-=0.6')
        .fromTo(imageRef.current, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6 }, '-=1.2')
        .fromTo(metaRef.current?.children || [], { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.1 }, '-=1');

      gsap.to(imageRef.current, {
        yPercent: 15, ease: 'none',
        scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading, profile]);

  const bandName = profile?.name || 'LYRALIZE';
  const tagline = profile?.bio || 'Shoegaze Collective from Indonesia';
  const bgUrl = profile?.hero_video_url ||
    'https://images.unsplash.com/photo-1493225457124-a1a2a5f5c937?q=80&w=2000&auto=format&fit=crop';

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-[#04060A] overflow-hidden">

      {/* ── Full-bleed background image ── */}
      <div className="absolute inset-0 z-0">
        <div
          ref={imageRef}
          className="absolute right-0 top-0 w-[85%] h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${bgUrl}')`,
            filter: 'grayscale(0.5) brightness(0.75) contrast(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060A] via-[#04060A]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#04060A]/30 via-transparent to-[#04060A]/50" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 flex flex-col min-h-[100svh] py-24 md:py-40">

        {/* Top meta pills — like Brandin's hero info badges */}
        <div ref={metaRef} className="flex flex-wrap gap-4 md:gap-6 mb-auto">
          <span className="inline-flex items-center gap-2 border border-[#3A609E] text-[#8FA9C4] px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase rounded-full">
            Based in Bandung, Indonesia
          </span>
          <span className="inline-flex items-center gap-2 border border-[#3A609E] text-[#8FA9C4] px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase rounded-full">
            Shoegaze · Dream Pop · Noise Rock
          </span>
          <span className="inline-flex items-center gap-2 border border-[#3A609E] text-[#8FA9C4] px-4 py-2 font-mono text-[10px] tracking-[0.25em] uppercase rounded-full">
            Est. 2025
          </span>
        </div>

        {/* Main headline */}
        <div className="mt-16 md:mt-24">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4] mb-4">
            Featured Work
          </div>

          <div ref={headlineRef} className="mb-4">
            {!loading && (
              <img
                src="/(LOGO) LYRA (WHITE).png"
                alt={bandName}
                className="h-20 md:h-36 w-auto object-contain drop-shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            )}
            {/* Fallback text if image fails to load */}
            <h1 className="cs-hero text-[#F0EBE0] leading-[0.9] hidden">
              {!loading && bandName}
            </h1>
          </div>

          {/* Sub info row */}
          <div ref={subRef} className="mt-10 md:mt-14 flex flex-col md:flex-row items-start gap-8 md:gap-16">
            <p className="max-w-lg font-mono text-sm md:text-base text-[#8FA9C4] leading-relaxed">
              {tagline}. Walls of reverb, blurred vocals, and melodies that
              dissolve into <span className="text-[#8FA9C4]">static</span> —
              music for the space between waking and dreaming.
            </p>
          </div>

          {/* CTA row */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/releases"
              className="inline-flex items-center gap-3 bg-[#8FA9C4] text-[#04060A] px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[#A0C4E2] transition-colors rounded-full">
              Listen Now →
            </a>
            <a href="/#contact"
              className="inline-flex items-center gap-3 border border-[#3A609E] text-[#8FA9C4] px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-[#8FA9C4] hover:text-[#8FA9C4] transition-colors rounded-full">
              Get in Touch
            </a>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="mt-auto pt-16 flex items-center gap-4 font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">
          <div className="w-px h-12 bg-[#3A609E] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[#8FA9C4] animate-pulse" />
          </div>
          <span className="text-[#8FA9C4]">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
