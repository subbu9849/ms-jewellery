// client/src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Search } from 'lucide-react';

export default function Navbar({ onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      
      {/* Top bar — contact info */}
      <div style={{ backgroundColor: '#800020' }} className="text-white text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              <a href="tel:+919876543210" className="hover:text-yellow-300">+91 98765 43210</a>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <MapPin size={12} />
              Prathipadu Mandal, Guntur Dist, AP 522019
            </span>
          </div>
          <span className="text-yellow-300 text-xs font-medium">
            ✨ Making Charges: As Low as ₹350/gram
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <nav style={{ backgroundColor: '#1a0a00' }} className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <div className="flex flex-col leading-none">
              <span style={{ color: '#C9A84C', fontFamily: 'Georgia, serif' }} 
                    className="text-2xl font-bold tracking-wider">
                MS Jewellery
              </span>
              <span className="text-gray-400 text-xs tracking-widest">
                PRATHIPADU • GUNTUR
              </span>
            </div>
          </Link>

          {/* Search bar — desktop */}
          <form onSubmit={handleSearch} 
                className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rings, necklaces, bangles..."
                className="w-full px-4 py-2 pr-10 rounded-full bg-white text-gray-800 
                           text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#C9A84C' }}
              />
              <button type="submit" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                                 hover:text-yellow-600">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {[
              { path: '/', label: 'Home' },
              { path: '/catalog', label: 'Catalog' },
              { path: '/catalog?metalType=Gold', label: 'Gold' },
              { path: '/catalog?metalType=Silver', label: 'Silver' },
              { path: '/about', label: 'About Us' },
            ].map(({ path, label }) => (
              <Link key={path} to={path}
                className={`transition-colors hover:text-yellow-400 ${
                  isActive(path) ? 'text-yellow-400 border-b-2 border-yellow-400 pb-0.5' 
                                 : 'text-gray-200'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden text-white p-1">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-2">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewelry..."
              className="flex-1 px-4 py-2 rounded-l-full bg-white text-gray-800 text-sm 
                         focus:outline-none"
            />
            <button type="submit"
                    style={{ backgroundColor: '#C9A84C' }}
                    className="px-4 py-2 rounded-r-full text-white">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-2 flex flex-col gap-3 text-gray-200">
            {['Home', 'Catalog', 'About Us'].map((label) => (
              <Link key={label} to={label === 'Home' ? '/' : `/${label.toLowerCase().replace(' ', '')}`}
                    className="hover:text-yellow-400 transition-colors px-2 py-1 border-b 
                               border-gray-700"
                    onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}