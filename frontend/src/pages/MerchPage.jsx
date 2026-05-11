import { useEffect, useState } from 'react';
import gsap from 'gsap';
import api from '../services/api';

const MerchPage = () => {
  const [merchItems, setMerchItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reveal animation
    gsap.fromTo('.page-title', { opacity: 0, y: 50, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' });

    // Fetch Merch from Laravel API
    const fetchMerch = async () => {
      try {
        const response = await api.get('/merch');
        if (response.data && response.data.length > 0) {
          setMerchItems(response.data);
        } else {
          setMerchItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch merch", error);
        setMerchItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMerch();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[#050508] relative">
      <h1 className="page-title text-6xl md:text-8xl font-distorted text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-white opacity-80 mb-16 text-center uppercase">
        MERCH
      </h1>

      {loading ? (
        <div className="text-center text-[#8B5CF6] animate-pulse font-display">Loading Noise...</div>
      ) : merchItems.length === 0 ? (
        <div className="text-center text-gray-500 font-sans tracking-widest uppercase">No merchandise available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {merchItems.map((item) => (
            <div key={item.id} className="group flex flex-col gap-4">
              <div className="relative aspect-[3/4] overflow-hidden bg-black border border-white/10">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 blur-[2px] group-hover:blur-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-500 font-display">NO IMAGE</div>
                )}
                <div className="absolute inset-0 bg-[#8B5CF6]/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-bold text-xl uppercase tracking-widest">{item.name}</h3>
                  <p className="text-gray-400 font-sans tracking-widest text-sm mt-1">IDR {item.price}</p>
                </div>
                {item.in_stock ? (
                  <button className="border border-[#8B5CF6] text-[#8B5CF6] px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#8B5CF6] hover:text-white transition-all">
                    Purchase
                  </button>
                ) : (
                  <span className="border border-red-500/50 text-red-500/50 px-4 py-2 text-xs uppercase tracking-widest">
                    Sold Out
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchPage;
