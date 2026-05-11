import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const showsList = [
  { id: 1, date: 'OCT 12', location: 'BERLIN, DE', venue: 'Berghain Kantine', status: 'SOLD OUT' },
  { id: 2, date: 'OCT 15', location: 'LONDON, UK', venue: 'Printworks', status: 'TICKETS' },
  { id: 3, date: 'OCT 18', location: 'PARIS, FR', venue: 'La Machine', status: 'TICKETS' },
  { id: 4, date: 'OCT 22', location: 'AMSTERDAM, NL', venue: 'Paradiso', status: 'TICKETS' },
  { id: 5, date: 'NOV 05', location: 'TOKYO, JP', venue: 'Liquidroom', status: 'TICKETS' },
  { id: 6, date: 'NOV 12', location: 'SEOUL, KR', venue: 'V-Hall', status: 'SOLD OUT' },
  { id: 7, date: 'NOV 20', location: 'JAKARTA, ID', venue: 'M Bloc Space', status: 'TICKETS' },
  { id: 8, date: 'DEC 01', location: 'NEW YORK, US', venue: 'Brooklyn Steel', status: 'TICKETS' },
];

const Shows = () => {
  const sectionRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
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
      id="shows"
      ref={sectionRef}
      className="w-full py-24 md:py-40 bg-[#050816] text-white"
    >
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-12">Live Experiences</h2>
        
        <div className="border-t border-white/10">
          {showsList.map((show, index) => (
            <div
              key={show.id}
              ref={(el) => (rowsRef.current[index] = el)}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between py-8 md:py-12 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-24 w-full md:w-auto">
                <span className="text-2xl md:text-4xl font-display font-light text-gray-400 group-hover:text-[#3B82F6] transition-colors w-32">
                  {show.date}
                </span>
                <div>
                  <h3 className="text-xl md:text-3xl font-display uppercase tracking-wide group-hover:translate-x-4 transition-transform duration-500 ease-out">
                    {show.location}
                  </h3>
                  <p className="text-sm text-gray-500 tracking-widest mt-2 uppercase">
                    {show.venue}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className={`text-xs uppercase tracking-widest ${show.status === 'Sold Out' ? 'text-red-500' : 'text-gray-400'}`}>
                  {show.status}
                </span>
                <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowRight size={20} className="transform group-hover:-rotate-45 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shows;
