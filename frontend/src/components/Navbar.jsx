import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home',     href: '/',         num: '01' },
    { name: 'Releases', href: '/releases', num: '02' },
    { name: 'Shows',    href: '/shows',    num: '03' },
    { name: 'Gallery',  href: '/gallery',  num: '04' },
    { name: 'Merch',    href: '/merch',    num: '05' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#F0EBE0]/95 backdrop-blur-xl py-4 border-b border-[#C8C0A8]' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="z-50 flex items-center gap-3">
            <span className="cs-sm text-[#0C1B4D] leading-none">Lyralize</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link key={link.name} to={link.href}
                  className={`flex items-center gap-1.5 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                    active ? 'text-[#1E3FA8]' : 'text-[#4A6090] hover:text-[#0C1B4D]'
                  }`}
                >
                  <span className="link-underline">{link.name}</span>
                </Link>
              );
            })}

            {/* CTA */}
            <Link to="/#contact"
              className="ml-4 inline-flex items-center gap-2 bg-[#1E3FA8] text-[#F0EBE0] px-6 py-2.5 font-mono text-[10px] tracking-[0.25em] uppercase hover:bg-[#2A52C9] transition-colors rounded-full"
            >
              Connect With Us
            </Link>
          </div>

          <button className="md:hidden z-50 text-[#0C1B4D]" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-[#F0EBE0] z-40 flex flex-col justify-center items-center transition-transform duration-700 ease-in-out ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="flex flex-col gap-8 text-center">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-4 text-[#0C1B4D] hover:text-[#1E3FA8] transition-colors duration-300">
              <span className="font-mono text-sm text-[#1E3FA8]/60">// {link.num}</span>
              <span className="cs-md leading-none">{link.name}</span>
            </Link>
          ))}
          <Link to="/#contact" onClick={() => setIsOpen(false)}
            className="mt-4 inline-flex items-center justify-center gap-2 bg-[#1E3FA8] text-[#F0EBE0] px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase hover:bg-[#2A52C9] transition-colors rounded-full mx-auto"
          >
            Connect With Us
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
