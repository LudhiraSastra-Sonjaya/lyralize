import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
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

        {/* Main headline */}
        <div className="mt-16 md:mt-24">

          <div ref={headlineRef} className="flex items-center justify-center mb-50">
            {!loading && (
              <img
                src="/(LOGO) LYRA (WHITE).png"
                alt={bandName}
                className="h-100px w-auto drop-shadow-2xl"
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

        </div>
      </div>
    </section>
  );
};

export default Hero;
