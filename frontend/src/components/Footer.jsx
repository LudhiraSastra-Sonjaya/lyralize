const Footer = () => {
  return (
    <footer className="w-full bg-[#050816] pt-24 pb-8 md:pt-40 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-6">
              Connect
            </h2>
            <p className="text-gray-400 font-light text-lg">
              For booking, press, and general inquiries. We are always looking for new architectural spaces to fill with sound.
            </p>
            <a 
              href="mailto:contact@lanterne.com" 
              className="inline-block mt-8 text-2xl md:text-4xl font-display font-light hover:text-[#3B82F6] transition-colors relative group"
            >
              contact@lanterne.com
              <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#3B82F6] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
            </a>
          </div>

          <div className="flex flex-col gap-4 text-sm tracking-widest uppercase text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Spotify</a>
            <a href="#" className="hover:text-white transition-colors">Apple Music</a>
            <a href="#" className="hover:text-white transition-colors">YouTube</a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-gray-600 uppercase">
          <p>&copy; {new Date().getFullYear()} Lanterne Collective. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
      
      {/* Huge Background Text */}
      <h1 className="absolute -bottom-10 md:-bottom-24 left-1/2 transform -translate-x-1/2 text-[20vw] md:text-[15vw] font-display font-bold uppercase leading-none tracking-tighter text-white/5 whitespace-nowrap pointer-events-none select-none">
        LANTERNE
      </h1>
    </footer>
  );
};

export default Footer;
