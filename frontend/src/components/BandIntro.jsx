import { useEffect, useState } from 'react';
import api from '../services/api';

const BandIntro = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/band-profile');
        setProfile(res.data);
      } catch (e) {
        console.error('Failed to fetch band profile', e);
      }
    };
    fetchProfile();
  }, []);

  const bandName = profile?.name || 'LYRA';
  // Use profile.bio if available, otherwise use default text from the screenshot
  const tagline = profile?.bio || 'Keresahan mimpi dan kecemasan emosional menjadi latar belakang terbentuknya LYRA, sebuah band yang beraliran shoegaze / doomgaze asal Bandung yang dibentuk pada Maret 2025, band ini beranggotakan Abizair Abrar (Vokal/Bass), Fadhilla Maulana (Gitar), dan Jauzaa Fachrie (Drum).';

  return (
    <section className="w-full bg-[#04060A] py-16 md:py-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex flex-col md:flex-row gap-12 md:gap-24 items-start">
        
        {/* Left: Image */}
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-[4/4.5] overflow-hidden">
            <img 
              src="/LyralizeManggung.jpg" 
              alt={bandName}
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(0.6) brightness(0.6) contrast(1.15)' }}
            />
          </div>
        </div>
        
        {/* Right: Content */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex items-center gap-6 mb-4">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#8FA9C4]">
              // ABOUT US
            </span>
          </div>
          
          <h2 className="cs-lg text-[#F0EBE0] leading-[1] mb-10">
            {bandName}
          </h2>
          
          <div className="space-y-6 font-mono text-sm md:text-base text-[#8FA9C4] leading-relaxed">
            <p>
              {tagline}
            </p>
            <p>
              Walls of reverb, blurred vocals, and melodies that dissolve into static — music for the space between waking and dreaming.
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default BandIntro;
