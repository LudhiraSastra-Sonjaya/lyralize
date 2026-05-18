import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const Releases = () => {
  const sectionRef = useRef(null);
  const rowsRef = useRef([]);
  const floatingImgRef = useRef(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await api.get('/albums');
        setAlbums(res.data);
      } catch (e) {
        console.error('Failed to fetch albums', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (loading || albums.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(rowsRef.current.filter(Boolean),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, albums]);

  // Floating image follows cursor
  const handleMouseMove = useCallback((e) => {
    if (floatingImgRef.current) {
      gsap.to(floatingImgRef.current, {
        x: e.clientX - 160,
        y: e.clientY - 200,
        duration: 0.4,
        ease: 'power3.out',
      });
    }
  }, []);

  const filters = ['All', 'Album', 'EP', 'Single'];
  const filteredAlbums = activeFilter === 'All'
    ? albums
    : albums.filter(a => (a.type || 'Album').toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="releases" ref={sectionRef} className="w-full bg-[#04060A] py-20 md:py-48 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">

        {/* Section header */}
        <div className="flex items-center gap-6 mb-6">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">// 03</span>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">Discography</span>
          <div className="flex-1 h-px bg-[#3A609E]" />
          <span className="hidden md:block font-mono text-sm text-[#3A609E] select-none">ディスコグラフィー</span>
        </div>

        {/* Title row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div>
            <h2 className="cs-lg text-[#F0EBE0] leading-[1]">
              Selected<br />
              <span className="text-[#8FA9C4]">Recordings</span>
            </h2>
          </div>
          <p className="max-w-sm font-mono text-sm text-[#8FA9C4] leading-relaxed">
            Albums, EPs, and singles pressed on tape, wax, and the
            occasional cloud. Hover to preview, click to listen.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-4 mb-16">
          {filters.map((f) => (
            <button key={f}
              onClick={() => setActiveFilter(f)}
              className={`font-mono text-[11px] tracking-[0.25em] uppercase px-5 py-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                activeFilter === f
                  ? 'bg-[#8FA9C4] text-[#04060A] border-[#8FA9C4]'
                  : 'border-[#3A609E] text-[#8FA9C4] hover:border-[#8FA9C4] hover:text-[#8FA9C4]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Floating preview image */}
        {hoveredAlbum?.cover_image_url && (
          <img
            ref={floatingImgRef}
            src={hoveredAlbum.cover_image_url}
            alt=""
            className={`portfolio-row-image ${hoveredAlbum ? 'visible' : ''}`}
          />
        )}

        {loading ? (
          <div className="text-[#8FA9C4] font-mono text-sm animate-pulse tracking-widest uppercase">Loading recordings...</div>
        ) : filteredAlbums.length === 0 ? (
          <div className="text-[#8FA9C4] font-mono tracking-widest uppercase text-sm">No releases found.</div>
        ) : (
          <div className="border-t border-[#3A609E]">
            {filteredAlbums.map((album, index) => {
              const releaseYear = new Date(album.release_date).getFullYear();
              return (
                <div key={album.id} ref={(el) => (rowsRef.current[index] = el)}
                  className="group grid grid-cols-12 gap-4 md:gap-8 items-center py-8 md:py-10 border-b border-[#3A609E] hover:bg-[#8FA9C4]/5 transition-colors duration-500 cursor-pointer px-2 md:px-4"
                  onMouseEnter={() => setHoveredAlbum(album)}
                  onMouseLeave={() => setHoveredAlbum(null)}
                  onMouseMove={handleMouseMove}
                >
                  {/* Number */}
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-[11px] tracking-[0.3em] text-[#8FA9C4]">
                      // {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="col-span-6 md:col-span-5">
                    <h3 className="cs-sm text-[#F0EBE0] leading-none group-hover:text-[#8FA9C4] group-hover:translate-x-2 transition-all duration-500">
                      {album.title}
                    </h3>
                  </div>

                  {/* Type */}
                  <div className="hidden md:block col-span-2">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#8FA9C4]">
                      {album.type || 'ALBUM'}
                    </span>
                  </div>

                  {/* Year */}
                  <div className="hidden md:block col-span-2">
                    <span className="font-mono text-xs text-[#8FA9C4]">
                      {isNaN(releaseYear) ? '' : releaseYear}
                    </span>
                  </div>

                  {/* Arrow + Links */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                    {album.spotify_url && (
                      <a href={album.spotify_url} target="_blank" rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#8FA9C4] hover:text-[#8FA9C4] transition-colors" title="Spotify">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.68 18.72 12.96c.361.181.54.78.24 1.08zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                      </a>
                    )}
                    {album.apple_music_url && (
                      <a href={album.apple_music_url} target="_blank" rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#8FA9C4] hover:text-[#8FA9C4] transition-colors" title="Apple Music">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.111 16.59c-.43.513-.915.932-1.353 1.025-1.157.252-1.568-.45-3.036-.45-1.488 0-2.02.668-3.047.45-.487-.105-1.036-.593-1.636-1.32-1.611-1.942-2.73-5.267-1.042-7.854.85-1.303 2.122-2.036 3.428-2.062 1.357-.027 2.473.842 3.203.842.71 0 2.127-.991 3.659-.838 1.557.155 2.802.735 3.593 1.862-2.916 1.605-2.42 5.568.423 6.643-.586 1.458-1.465 2.624-2.192 3.702z" />
                        </svg>
                      </a>
                    )}
                    <div className="w-10 h-10 rounded-full border border-[#3A609E] flex items-center justify-center group-hover:bg-[#8FA9C4] group-hover:border-[#8FA9C4] transition-all duration-300">
                      <ArrowUpRight size={16} className="text-[#8FA9C4] group-hover:text-[#04060A] transition-colors duration-300" />
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

export default Releases;
