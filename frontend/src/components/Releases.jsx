import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const Releases = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

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
      gsap.fromTo(cardsRef.current.filter(Boolean),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, albums]);

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
            occasional cloud.
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

        {loading ? (
          <div className="text-[#8FA9C4] font-mono text-sm animate-pulse tracking-widest uppercase">Loading recordings...</div>
        ) : filteredAlbums.length === 0 ? (
          <div className="text-[#8FA9C4] font-mono tracking-widest uppercase text-sm">No releases found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
            {filteredAlbums.map((album, index) => {
              const releaseYear = new Date(album.release_date).getFullYear();
              return (
                <div key={album.id} ref={(el) => (cardsRef.current[index] = el)}
                  className="group flex flex-col bg-[#0E1A2F]/20 border border-[#3A609E]/40 rounded-xl overflow-hidden hover:border-[#8FA9C4] hover:bg-[#8FA9C4]/5 transition-all duration-500 cursor-pointer"
                >
                  {/* Cover Image */}
                  <div className="w-full aspect-square overflow-hidden relative bg-[#0E1A2F]/40 border-b border-[#3A609E]/30">
                    {album.cover_image_url ? (
                      <img 
                        src={album.cover_image_url} 
                        alt={album.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-xs text-[#3A609E] uppercase tracking-widest">No Cover</span>
                      </div>
                    )}
                    
                    {/* Hover overlay with ArrowUpRight */}
                    <div className="absolute inset-0 bg-[#04060A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                       <div className="w-12 h-12 rounded-full border border-[#F0EBE0] flex items-center justify-center text-[#F0EBE0] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                         <ArrowUpRight size={20} />
                       </div>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8FA9C4]">
                        {album.type || 'ALBUM'}
                      </span>
                      <span className="font-mono text-xs text-[#8FA9C4]">
                        {isNaN(releaseYear) ? '' : releaseYear}
                      </span>
                    </div>

                    <h3 className="cs-sm text-[#F0EBE0] leading-snug mb-6 group-hover:text-[#8FA9C4] transition-colors duration-300">
                      {album.title}
                    </h3>

                    {/* Platform Streaming Logos */}
                    <div className="mt-auto pt-4 border-t border-[#3A609E]/30 flex items-center gap-4">
                      {album.spotify_url && (
                        <a href={album.spotify_url} target="_blank" rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#8FA9C4]/70 hover:text-[#1DB954] transition-colors duration-300" title="Spotify">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.68 18.72 12.96c.361.181.54.78.24 1.08zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                          </svg>
                        </a>
                      )}
                      {album.apple_music_url && (
                        <a href={album.apple_music_url} target="_blank" rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#8FA9C4]/70 hover:text-[#FC3C44] transition-colors duration-300" title="Apple Music">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.111 16.59c-.43.513-.915.932-1.353 1.025-1.157.252-1.568-.45-3.036-.45-1.488 0-2.02.668-3.047.45-.487-.105-1.036-.593-1.636-1.32-1.611-1.942-2.73-5.267-1.042-7.854.85-1.303 2.122-2.036 3.428-2.062 1.357-.027 2.473.842 3.203.842.71 0 2.127-.991 3.659-.838 1.557.155 2.802.735 3.593 1.862-2.916 1.605-2.42 5.568.423 6.643-.586 1.458-1.465 2.624-2.192 3.702z" />
                          </svg>
                        </a>
                      )}
                      {album.youtube_url && (
                        <a href={album.youtube_url} target="_blank" rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#8FA9C4]/70 hover:text-[#FF0000] transition-colors duration-300" title="YouTube">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                      )}
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
