import Hero from '../components/Hero';
import About from '../components/About';
import Releases from '../components/Releases';
import Shows from '../components/Shows';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />

      {/* Marquee divider */}
      <div className="bg-[#0E1A2F] border-y border-[#3A609E] py-4 overflow-hidden">
        <div className="marquee-track font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              New Release
              <span className="text-[#8FA9C4]/30">✶</span>
              Out Now
              <span className="text-[#8FA9C4]/30">✶</span>
              Shoegaze · Dream Pop · Noise
              <span className="text-[#8FA9C4]/30">✶</span>
            </span>
          ))}
        </div>
      </div>

      <About />
      <Releases />

      {/* Marquee divider */}
      <div className="bg-[#0E1A2F] border-y border-[#3A609E] py-4 overflow-hidden">
        <div className="marquee-track font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]/50">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              Live Shows
              <span className="text-[#8FA9C4]/20">✶</span>
              Tour Dates
              <span className="text-[#8FA9C4]/20">✶</span>
              Bandung · Jakarta · Yogyakarta
              <span className="text-[#8FA9C4]/20">✶</span>
            </span>
          ))}
        </div>
      </div>

      <Shows />
      <Gallery />
      <Contact />
    </>
  );
};

export default Home;
