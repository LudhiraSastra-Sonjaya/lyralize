import { useEffect, useState } from 'react';
import gsap from 'gsap';
import api from '../services/api';

const MerchPage = () => {
  const [merchItems, setMerchItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo('.page-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
    const fetchMerch = async () => {
      try {
        const res = await api.get('/merch');
        setMerchItems(res.data || []);
      } catch (e) {
        console.error('Failed to fetch merch', e);
        setMerchItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMerch();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0EBE0] pt-40 md:pt-48 pb-24 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16">

        <div className="flex items-center gap-4 mb-10 page-title overflow-hidden">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#1E3FA8] shrink-0">// 05</span>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#4A6090] shrink-0">General Store</span>
          <div className="flex-1 h-px bg-[#C8C0A8]" />
        </div>

        <div className="flex flex-col gap-6 mb-16">
          <h1 className="page-title cs-hero text-[#0C1B4D] leading-[0.9]">Merch.</h1>
          <p className="page-title max-w-md font-mono text-sm md:text-base text-[#4A6090] leading-relaxed">
            Tees, tapes, and artifacts from the void. Printed slow,
            packed by hand, shipped with static.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-[#1E3FA8] font-mono text-sm animate-pulse tracking-widest uppercase py-24">
            Loading storefront...
          </div>
        ) : merchItems.length === 0 ? (
          <div className="text-center text-[#4A6090] font-mono tracking-widest uppercase py-24 text-sm">
            No merchandise available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {merchItems.map((item, i) => (
              <div key={item.id} className="group flex flex-col gap-4">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#E2DBC8] border border-[#C8C0A8]">
                  {item.image ? (
                    <img src={item.image} alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ filter: 'grayscale(0.2) brightness(0.9) contrast(1.05)' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#4A6090] font-mono tracking-widest text-xs">
                      NO IMAGE
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#1E3FA8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />
                  <div className="absolute top-3 left-3 blue-pill">// {String(i + 1).padStart(2, '0')}</div>
                  {!item.in_stock && (
                    <div className="absolute top-4 right-[-34px] rotate-45 bg-[#0C1B4D]/10 text-[#0C1B4D]/50 border border-[#0C1B4D]/15 px-10 py-1 font-mono text-[10px] tracking-[0.25em] uppercase">
                      Sold Out
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-mono text-base text-[#0C1B4D] leading-tight">{item.name}</h3>
                    <p className="font-mono text-sm text-[#4A6090] mt-2">
                      IDR {Number(item.price).toLocaleString('id-ID')}
                    </p>
                  </div>
                  {item.in_stock ? (
                    <button className="shrink-0 border border-[#1E3FA8] text-[#1E3FA8] px-5 py-2.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:bg-[#1E3FA8] hover:text-[#F0EBE0] transition-colors rounded-full cursor-pointer">
                      Buy
                    </button>
                  ) : (
                    <span className="shrink-0 border border-[#C8C0A8] text-[#4A6090] px-5 py-2.5 font-mono text-[10px] tracking-[0.25em] uppercase rounded-full">
                      —
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchPage;
