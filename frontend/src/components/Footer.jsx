import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#E2DBC8] border-t border-[#C8C0A8] pt-24 pb-10 relative overflow-hidden">
      {/* Top marquee */}
      <div className="absolute top-0 left-0 right-0 border-b border-[#C8C0A8] py-4 overflow-hidden bg-[#E8E2D0]">
        <div className="marquee-track font-mono text-[11px] tracking-[0.3em] uppercase text-[#1E3FA8]">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              Lyralize
              <span className="text-[#1E3FA8]/30">✶</span>
              Shoegaze Collective
              <span className="text-[#1E3FA8]/30">✶</span>
              Bandung · Indonesia
              <span className="text-[#1E3FA8]/30">✶</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          {/* Left */}
          <div>
            <span className="section-label">// Connect</span>
            <h2 className="cs-lg text-[#0C1B4D] leading-[1] mt-6 mb-6">
              Drop into<br />
              the <span className="text-[#1E3FA8]">void</span>.
            </h2>
            <p className="font-mono text-sm text-[#4A6090] leading-relaxed max-w-lg">
              For booking, press, collaborations, and anything in between.
              We exist somewhere between the feedback and the silence.
            </p>
            <a href="mailto:hello@lyralize.com"
              className="inline-block mt-8 cs-sm text-[#0C1B4D] link-underline hover:text-[#1E3FA8] transition-colors leading-none">
              hello@lyralize.com
            </a>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <span className="section-label">// Sitemap</span>
              <ul className="mt-6 space-y-4 font-mono text-sm text-[#4A6090]">
                <li><Link to="/" className="link-underline hover:text-[#1E3FA8] transition-colors">Home</Link></li>
                <li><Link to="/releases" className="link-underline hover:text-[#1E3FA8] transition-colors">Releases</Link></li>
                <li><Link to="/shows" className="link-underline hover:text-[#1E3FA8] transition-colors">Shows</Link></li>
                <li><Link to="/gallery" className="link-underline hover:text-[#1E3FA8] transition-colors">Gallery</Link></li>
                <li><Link to="/merch" className="link-underline hover:text-[#1E3FA8] transition-colors">Merch</Link></li>
              </ul>
            </div>
            <div>
              <span className="section-label">// Elsewhere</span>
              <ul className="mt-6 space-y-4 font-mono text-sm text-[#4A6090]">
                <li><a href="#" className="link-underline hover:text-[#1E3FA8] transition-colors">Instagram</a></li>
                <li><a href="#" className="link-underline hover:text-[#1E3FA8] transition-colors">Spotify</a></li>
                <li><a href="#" className="link-underline hover:text-[#1E3FA8] transition-colors">YouTube</a></li>
                <li><a href="#" className="link-underline hover:text-[#1E3FA8] transition-colors">Bandcamp</a></li>
                <li><a href="#" className="link-underline hover:text-[#1E3FA8] transition-colors">SoundCloud</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#C8C0A8] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] tracking-[0.25em] uppercase text-[#4A6090]">
          <p>© {year} Lyralize. All frequencies reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#1E3FA8] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#1E3FA8] transition-colors">Terms</a>
            <Link to="/admin/login" className="hover:text-[#1E3FA8] transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute -bottom-8 md:-bottom-16 left-1/2 transform -translate-x-1/2 cs-hero text-[#1E3FA8]/[0.04] whitespace-nowrap pointer-events-none select-none leading-none">
        Lyralize
      </div>
    </footer>
  );
};

export default Footer;
