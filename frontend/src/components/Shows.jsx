import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const Shows = () => {
  const sectionRef = useRef(null);
  const rowsRef = useRef([]);
  const [showsList, setShowsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await api.get('/shows');
        setShowsList(res.data);
      } catch (e) {
        console.error('Failed to fetch shows', e);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  useEffect(() => {
    if (loading || showsList.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(rowsRef.current.filter(Boolean),
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, showsList]);

  return (
    <section id="shows" ref={sectionRef} className="w-full bg-[#F0EBE0] py-20 md:py-48 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">

        {/* Section header */}
        <div className="flex items-center gap-6 mb-6">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#1E3FA8]">// 04</span>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#4A6090]">Tour Diary</span>
          <div className="flex-1 h-px bg-[#C8C0A8]" />
          <span className="hidden md:block font-mono text-sm text-[#C8C0A8] select-none">ツアー</span>
        </div>

        {/* Title row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 md:mb-28">
          <h2 className="cs-lg text-[#0C1B4D] leading-[1]">
            Where we'll<br />
            be <span className="text-[#1E3FA8]">playing</span>.
          </h2>
          <p className="max-w-sm font-mono text-sm text-[#4A6090] leading-relaxed">
            Every city on this list is a small reason to
            drive too far and sleep too little.
          </p>
        </div>

        {loading ? (
          <div className="text-[#1E3FA8] font-mono text-sm animate-pulse tracking-widest uppercase">Loading dates...</div>
        ) : showsList.length === 0 ? (
          <div className="text-[#4A6090] font-mono tracking-widest text-sm uppercase">No upcoming shows at the moment.</div>
        ) : (
          <div className="border-t border-[#C8C0A8]">
            {showsList.map((show, index) => {
              const dateObj = new Date(show.show_date || new Date());
              const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
              const day = dateObj.getDate().toString().padStart(2, '0');
              const year = dateObj.getFullYear();
              const status = show.ticket_url ? 'TICKETS' : 'SOLD OUT';
              const isExpanded = expandedIndex === index;

              return (
                <div key={show.id} ref={(el) => (rowsRef.current[index] = el)}
                  className="border-b border-[#C8C0A8]"
                >
                  <div
                    className="group grid grid-cols-12 gap-4 md:gap-8 items-center py-8 md:py-10 hover:bg-[#1E3FA8]/5 transition-colors duration-500 cursor-pointer px-2 md:px-4"
                    onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                  >
                    {/* Date */}
                    <div className="col-span-3 md:col-span-2 flex flex-col">
                      <span className="cs-md text-[#0C1B4D] leading-none">{day}</span>
                      <span className="font-mono text-[10px] tracking-[0.25em] mt-1 text-[#4A6090]">
                        {month} · {year}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="col-span-6 md:col-span-5">
                      <h3 className="cs-sm text-[#0C1B4D] leading-none group-hover:translate-x-3 transition-transform duration-500">
                        {show.location}
                      </h3>
                    </div>

                    {/* Status */}
                    <div className="hidden md:block col-span-2">
                      <span className={`font-mono text-[10px] tracking-[0.25em] uppercase ${!show.ticket_url ? 'text-[#1E3FA8]' : 'text-[#4A6090]'}`}>
                        {status}
                      </span>
                    </div>

                    {/* Arrow/Expand */}
                    <div className="col-span-3 md:col-span-3 flex items-center justify-end gap-3">
                      {show.ticket_url && (
                        <a href={show.ticket_url} target="_blank" rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hidden md:inline-flex items-center gap-2 border border-[#1E3FA8] text-[#1E3FA8] px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-[#1E3FA8] hover:text-[#F0EBE0] transition-colors rounded-full">
                          Tickets
                        </a>
                      )}
                      <ChevronDown
                        size={20}
                        className={`text-[#4A6090] transition-transform duration-500 ${
                          isExpanded ? 'rotate-180 text-[#1E3FA8]' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expandable detail */}
                  <div className={`accordion-content ${isExpanded ? 'open' : ''}`}>
                    <div className="px-4 pb-8 grid grid-cols-12 gap-4 md:gap-8">
                      <div className="col-span-12 md:col-start-3 md:col-span-7">
                        <p className="font-mono text-sm text-[#4A6090] leading-relaxed mb-4">
                          <span className="text-[#1E3FA8]">Venue:</span> {show.venue}
                        </p>
                        {show.description && (
                          <p className="font-mono text-sm text-[#5A6080] leading-relaxed">
                            {show.description}
                          </p>
                        )}
                      </div>
                    </div>
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
