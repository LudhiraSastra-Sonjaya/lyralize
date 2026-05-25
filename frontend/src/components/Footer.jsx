import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Footer = () => {
  const year = new Date().getFullYear();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/band-profile');
        setProfile(res.data);
      } catch (e) {
        console.error('Failed to fetch band profile in footer', e);
      }
    };
    fetchProfile();
  }, []);

  return (
    <footer className="w-full bg-[#04060A] border-t border-[#3A609E] pt-24 pb-10 relative overflow-hidden">
      {/* Top marquee */}
      <div className="absolute top-0 left-0 right-0 border-b border-[#3A609E] py-4 overflow-hidden bg-[#0E1A2F]">
        <div className="marquee-track font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              Lyralize
              <span className="text-[#8FA9C4]/30">✶</span>
              Lyralize
              <span className="text-[#8FA9C4]/30">✶</span>
              Lyralize
              <span className="text-[#8FA9C4]/30">✶</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          {/* Left */}
          <div>
            <span className="section-label">// Connect</span>
            <h2 className="cs-lg text-[#F0EBE0] leading-[1] mt-6 mb-6">
              Drop into<br />
              the <span className="text-[#8FA9C4]">void</span>.
            </h2>
            <p className="font-mono text-sm text-[#8FA9C4] leading-relaxed max-w-lg">
              For booking, press, collaborations, and anything in between.
              We exist somewhere between the feedback and the silence.
            </p>
            <a href="mailto:hello@lyralize.com"
              className="inline-block mt-8 cs-sm text-[#F0EBE0] link-underline hover:text-[#8FA9C4] transition-colors leading-none">
              hello@lyralize.com
            </a>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="section-label">// Sitemap</span>
              <ul className="mt-6 space-y-4 font-mono text-sm text-[#8FA9C4]">
                <li><Link to="/" className="link-underline hover:text-[#8FA9C4] transition-colors">Home</Link></li>
                <li><Link to="/releases" className="link-underline hover:text-[#8FA9C4] transition-colors">Releases</Link></li>
                <li><Link to="/shows" className="link-underline hover:text-[#8FA9C4] transition-colors">Shows</Link></li>
                <li><Link to="/gallery" className="link-underline hover:text-[#8FA9C4] transition-colors">Gallery</Link></li>
                <li><Link to="/merch" className="link-underline hover:text-[#8FA9C4] transition-colors">Merch</Link></li>
              </ul>
            </div>
            <div>
              <span className="section-label">// Elsewhere</span>
              <ul className="mt-6 space-y-4 font-mono text-sm text-[#8FA9C4]">
                {profile ? (
                  <>
                    {profile.instagram_url && (
                      <li><a href={profile.instagram_url} target="_blank" rel="noreferrer" className="link-underline hover:text-[#8FA9C4] transition-colors">Instagram</a></li>
                    )}
                    {profile.spotify_url && (
                      <li><a href={profile.spotify_url} target="_blank" rel="noreferrer" className="link-underline hover:text-[#8FA9C4] transition-colors">Spotify</a></li>
                    )}
                    {profile.apple_music_url && (
                      <li><a href={profile.apple_music_url} target="_blank" rel="noreferrer" className="link-underline hover:text-[#8FA9C4] transition-colors">Apple Music</a></li>
                    )}
                    {profile.tiktok_url && (
                      <li><a href={profile.tiktok_url} target="_blank" rel="noreferrer" className="link-underline hover:text-[#8FA9C4] transition-colors">TikTok</a></li>
                    )}
                    {profile.youtube_url && (
                      <li><a href={profile.youtube_url} target="_blank" rel="noreferrer" className="link-underline hover:text-[#8FA9C4] transition-colors">YouTube</a></li>
                    )}
                  </>
                ) : (
                  <>
                    <li><a href="https://www.instagram.com/lyralize/" className="link-underline hover:text-[#8FA9C4] transition-colors">Instagram</a></li>
                    <li><a href="https://open.spotify.com/intl-id/artist/3lO2n4NxOlRrJOqX0U5B7a?si=09d8a863bd1149dc" className="link-underline hover:text-[#8FA9C4] transition-colors">Spotify</a></li>
                    <li><a href="#" className="link-underline hover:text-[#8FA9C4] transition-colors">Apple Music</a></li>
                    <li><a href="https://www.tiktok.com/@hellyeahlyra?is_from_webapp=1&sender_device=pc" className="link-underline hover:text-[#8FA9C4] transition-colors">TikTok</a></li>
                    <li><a href="#" className="link-underline hover:text-[#8FA9C4] transition-colors">YouTube</a></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#3A609E] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] tracking-[0.25em] uppercase text-[#8FA9C4]">
          <p>© {year} Lyralize. All frequencies reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#8FA9C4] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#8FA9C4] transition-colors">Terms</a>
            <Link to="/admin/login" className="hover:text-[#8FA9C4] transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
