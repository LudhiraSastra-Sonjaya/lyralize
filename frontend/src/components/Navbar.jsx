import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Releases', href: '/releases' },
    { name: 'Shows', href: '/shows' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Merch', href: '/merch' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
          scrolled ? 'bg-[#050508]/80 backdrop-blur-lg py-4 border-b border-white/5' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-display font-bold tracking-tighter uppercase z-50 text-[#8B5CF6] mix-blend-screen"
          >
            LANTERNE
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm uppercase tracking-widest transition-colors duration-300 relative group overflow-hidden ${location.pathname === link.href ? 'text-[#8B5CF6]' : 'text-gray-400 hover:text-white'}`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#8B5CF6] transform ${location.pathname === link.href ? 'translate-x-0' : '-translate-x-[101%] group-hover:translate-x-0'} transition-transform duration-300 ease-out`} />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[#0F0F1A] z-40 flex flex-col justify-center items-center transition-transform duration-700 ease-in-out ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col gap-8 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="text-4xl font-display font-bold uppercase tracking-wider text-gray-300 hover:text-[#8B5CF6] transition-colors duration-300 blur-[0.5px] hover:blur-0"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
