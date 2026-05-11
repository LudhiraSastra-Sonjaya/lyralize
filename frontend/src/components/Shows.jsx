import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const Shows = () => {
  const sectionRef = useRef(null);
  const rowsRef = useRef([]);
  const [showsList, setShowsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await api.get('/shows');
        setShowsList(response.data);
      } catch (error) {
        console.error('Failed to fetch shows', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  useEffect(() => {
    if (loading || showsList.length === 0) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowsRef.current.filter(Boolean),
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
  }, [loading, showsList]);

  return (
    <section
      id="shows"
      ref={sectionRef}
      className="w-full py-24 md:py-40 bg-[#050816] text-white"
    >
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-12">Live Experiences</h2>
        
        {loading ? (
          <div className="text-[#8B5CF6] font-display animate-pulse">Loading Dates...</div>
        ) : showsList.length === 0 ? (
          <div className="text-gray-500 font-sans tracking-widest text-sm uppercase">No upcoming shows at the moment.</div>
        ) : (
          <div className="border-t border-white/10">
            {showsList.map((show, index) => {
              const dateObj = new Date(show.date);
              const formattedDate = `${dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${dateObj.getDate().toString().padStart(2, '0')}`;
              
              // Assume if no ticket link, it's sold out or TBA. For now, we just show TICKETS or SOLD OUT.
              // You can update backend to add a 'status' field later. For now we will check ticket_link.
              const status = show.ticket_link ? 'TICKETS' : 'SOLD OUT';

              return (
                <div
                  key={show.id}
                  ref={(el) => (rowsRef.current[index] = el)}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between py-8 md:py-12 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer"
                  onClick={() => show.ticket_link && window.open(show.ticket_link, '_blank')}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-24 w-full md:w-auto">
                    <span className="text-2xl md:text-4xl font-display font-light text-gray-400 group-hover:text-[#8B5CF6] transition-colors w-32">
                      {formattedDate}
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
                    <span className={`text-xs uppercase tracking-widest ${!show.ticket_link ? 'text-red-500' : 'text-gray-400'}`}>
                      {status}
                    </span>
                    <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <ArrowRight size={20} className="transform group-hover:-rotate-45 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Shows;
