import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const Releases = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await api.get('/albums');
        setAlbums(response.data);
      } catch (error) {
        console.error('Failed to fetch albums', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (loading || albums.length === 0) return;

    const ctx = gsap.context(() => {
      // Staggered reveal for cards
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, albums]);

  return (
    <section
      id="releases"
      ref={sectionRef}
      className="w-full py-24 md:py-40 bg-[#0F172A] relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
          <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tighter mix-blend-difference text-white/90">
            Selected <br /> Works
          </h2>
          <p className="text-gray-400 mt-6 md:mt-0 max-w-sm text-sm uppercase tracking-widest text-right">
            Immersive soundscapes designed for modern spaces.
          </p>
        </div>

        {loading ? (
          <div className="text-[#8B5CF6] font-display animate-pulse text-xl">Loading Releases...</div>
        ) : albums.length === 0 ? (
          <div className="text-gray-500 font-sans tracking-widest uppercase">No releases found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {albums.map((album, index) => {
              const releaseYear = new Date(album.release_date).getFullYear();
              
              return (
                <div
                  key={album.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden mb-6 bg-[#050816]">
                    {album.cover_image_url ? (
                      <img
                        src={album.cover_image_url}
                        alt={album.title}
                        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">NO ARTWORK</div>
                    )}
                    
                    {/* Vinyl overlay effect */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-baseline border-b border-white/10 pb-4 mt-2">
                    <h3 className="text-xl md:text-2xl font-display font-medium uppercase tracking-tight group-hover:text-[#8B5CF6] transition-colors duration-300">
                      {album.title}
                    </h3>
                    <span className="text-sm text-gray-500 tracking-widest">{isNaN(releaseYear) ? '' : releaseYear}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-gray-400 tracking-widest uppercase">
                      {album.type || 'ALBUM'}
                    </p>
                    <div className="flex gap-4">
                      {album.spotify_url && (
                        <a href={album.spotify_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-[#1DB954] transition-colors" title="Listen on Spotify">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.68 18.72 12.96c.361.181.54.78.24 1.08zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </a>
                      )}
                      {album.apple_music_url && (
                        <a href={album.apple_music_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-gray-500 hover:text-[#FA243C] transition-colors" title="Listen on Apple Music">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.111 16.59c-.43.513-.915.932-1.353 1.025-1.157.252-1.568-.45-3.036-.45-1.488 0-2.02.668-3.047.45-.487-.105-1.036-.593-1.636-1.32-1.611-1.942-2.73-5.267-1.042-7.854.85-1.303 2.122-2.036 3.428-2.062 1.357-.027 2.473.842 3.203.842.71 0 2.127-.991 3.659-.838 1.557.155 2.802.735 3.593 1.862-2.916 1.605-2.42 5.568.423 6.643-.586 1.458-1.465 2.624-2.192 3.702zm-3.064-9.845c-.657.747-1.745 1.252-2.724 1.15-.224-1.135.321-2.28 1.002-3.039.673-.746 1.79-1.294 2.766-1.155.196 1.218-.396 2.283-1.044 3.044z"/>
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
