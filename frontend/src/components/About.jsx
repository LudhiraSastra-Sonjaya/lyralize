import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const expertiseItems = [
  {
    num: '01',
    title: 'Sonic Architecture',
    desc: 'We build walls of sound from layers of distortion, tremolo-drenched guitars, and vocals buried so deep in reverb they feel like a memory you can\'t quite place. Every frequency is intentional, every noise is curated.',
  },
  {
    num: '02',
    title: 'Live Experience',
    desc: 'Our live shows are immersive sonic rituals — blending blinding visuals, crushing volume, and atmosphere so thick you can feel it. We don\'t just play shows; we build environments.',
  },
  {
    num: '03',
    title: 'Visual Identity',
    desc: 'From album art to merch to stage design, every visual element is an extension of the sound — blurred, overexposed, and deeply intentional. Our aesthetic is as layered as our music.',
  },
  {
    num: '04',
    title: 'Recording & Production',
    desc: 'Formed in 2024, our music sits at the intersection of classic shoegaze, dream pop, and noise rock — equal parts My Bloody Valentine and the humid, restless energy of a Bandung night.',
  },
  {
    num: '05',
    title: 'Collaboration',
    desc: 'We thrive in the space between genres and disciplines. Whether it\'s working with visual artists, filmmakers, or fellow musicians, every collaboration pushes us into new sonic territory.',
  },
];

const About = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-reveal',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
      gsap.fromTo(imageRef.current, { y: 60 }, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="w-full bg-[#04060A] py-20 md:py-48 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">

        {/* Section header */}
        <div className="flex items-center gap-6 mb-6 about-reveal">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">// 02</span>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">Our Expertise</span>
          <div className="flex-1 h-px bg-[#3A609E]" />
        </div>

        {/* Title row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 md:mb-28 about-reveal">
          <div>
            <h2 className="cs-lg text-[#F0EBE0] leading-[1]">
              Crafting Sonic<br />
              <span className="text-[#8FA9C4]">Experiences</span>
            </h2>
          </div>
          <p className="max-w-sm font-mono text-sm text-[#8FA9C4] leading-relaxed">
            Lyralize is a five-piece shoegaze collective from Bandung,
            Indonesia. Noise, reverb, and a little bit of static.
          </p>
        </div>

        {/* Two-column: Accordion + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* Left: Accordion items */}
          <div className="about-reveal">
            {expertiseItems.map((item, i) => (
              <div key={item.num}
                className={`border-t border-[#3A609E] ${i === expertiseItems.length - 1 ? 'border-b' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-center justify-between py-6 md:py-8 group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[11px] tracking-[0.3em] text-[#8FA9C4] shrink-0">// {item.num}</span>
                    <span className={`cs-sm leading-none transition-colors duration-300 text-left ${
                      openIndex === i ? 'text-[#F0EBE0]' : 'text-[#8FA9C4] group-hover:text-[#F0EBE0]'
                    }`}>
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <ChevronDown
                      size={20}
                      className={`text-[#8FA9C4] transition-transform duration-500 ${
                        openIndex === i ? 'rotate-180 text-[#8FA9C4]' : ''
                      }`}
                    />
                  </div>
                </button>

                <div className={`accordion-content ${openIndex === i ? 'open' : ''}`}>
                  <div className="pb-8 pr-4 md:pr-16">
                    <div className="flex items-start gap-6">
                      <span className="cs-md text-[#3A609E] leading-none select-none shrink-0">
                        {item.num}
                      </span>
                      <p className="font-mono text-sm text-[#8FA9C4] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Image */}
          <div className="relative overflow-hidden h-[60vh] md:h-[80vh] about-reveal">
            <div
              ref={imageRef}
              className="absolute inset-[-10%] w-[120%] h-[120%] overflow-hidden flex scanlines"
            >
              {/* Sliding Marquee Track */}
              <div className="animate-image-marquee shrink-0">
                <img
                  src="/LyralizeManggung.jpg"
                  alt="Lyralize Live"
                  className="h-full w-auto max-w-none object-cover"
                  style={{ filter: 'grayscale(0.6) brightness(0.5) contrast(1.15)' }}
                />
                <img
                  src="/LyralizeManggung.jpg"
                  alt="Lyralize Live"
                  className="h-full w-auto max-w-none object-cover"
                  style={{ filter: 'grayscale(0.6) brightness(0.5) contrast(1.15)' }}
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-[#8FA9C4]/10 mix-blend-multiply pointer-events-none" />
            <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.25em] uppercase bg-[#04060A] text-[#8FA9C4] border border-[#3A609E] px-3 py-1.5">
              Fig. A — Rehearsal, March '26
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-16 flex flex-wrap gap-4 about-reveal">
          <Link to="/releases"
            className="inline-flex items-center gap-3 border border-[#8FA9C4] text-[#8FA9C4] px-8 py-4 font-mono text-[11px] tracking-[0.25em] uppercase hover:bg-[#8FA9C4] hover:text-[#04060A] transition-colors rounded-full">
            Discography →
          </Link>
          <Link to="/shows"
            className="inline-flex items-center gap-3 bg-[#8FA9C4] text-[#04060A] px-8 py-4 font-mono text-[11px] tracking-[0.25em] uppercase hover:bg-[#A0C4E2] transition-colors rounded-full">
            Upcoming Shows →
          </Link>
        </div>

        {/* Members grid */}
        <div className="mt-20 grid grid-cols-3 md:grid-cols-5 gap-6 about-reveal">
          {['Vocals', 'Guitar', 'Bass', 'Drums', 'Keys'].map((role, i) => (
            <div key={role} className="border-t border-[#3A609E] pt-4">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8FA9C4]">
                // {String(i + 1).padStart(2, '0')}
              </span>
              <p className="cs-sm text-[#F0EBE0] mt-2 leading-none">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
