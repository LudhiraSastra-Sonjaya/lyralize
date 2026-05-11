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
        // Fallback static data if API is empty for preview purposes
        const defaultMerch = [
          { id: 1, name: 'Distortion T-Shirt', price: '250.000', currency: 'IDR', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', ecommerce_link: '#' },
          { id: 2, name: 'Echoes Vinyl LP', price: '450.000', currency: 'IDR', image_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop', ecommerce_link: '#' },
          { id: 3, name: 'Noise Cassette', price: '120.000', currency: 'IDR', image_url: 'https://images.unsplash.com/photo-1594954955745-7798c1cdcaaa?q=80&w=800&auto=format&fit=crop', ecommerce_link: '#' }
        ];
        
        const response = await api.get('/merch');
        if (response.data.data && response.data.data.length > 0) {
          setMerchItems(response.data.data);
        } else {
          setMerchItems(defaultMerch);
        }
      } catch (error) {
        console.error("Failed to fetch merch", error);
        // Fallback if backend isn't populated
        setMerchItems([
          { id: 1, name: 'Distortion T-Shirt', price: '250.000', currency: 'IDR', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', ecommerce_link: 'https://tokopedia.com' },
          { id: 2, name: 'Echoes Vinyl LP', price: '450.000', currency: 'IDR', image_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop', ecommerce_link: 'https://shopee.co.id' }
        ]);
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {merchItems.map((item, index) => (
            <div key={item.id} className="group flex flex-col gap-4">
              <div className="relative aspect-[3/4] overflow-hidden bg-black border border-white/10">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 blur-[2px] group-hover:blur-0"
                />
                <div className="absolute inset-0 bg-[#8B5CF6]/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-bold text-xl uppercase tracking-widest">{item.name}</h3>
                  <p className="text-gray-400 font-sans tracking-widest text-sm mt-1">{item.currency} {item.price}</p>
                </div>
                <a 
                  href={item.ecommerce_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-[#8B5CF6] text-[#8B5CF6] px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#8B5CF6] hover:text-white transition-all"
                >
                  Purchase
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchPage;
