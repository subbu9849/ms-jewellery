// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';

// Simple footer component inline
function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a0a00' }} className="text-gray-400 py-10 px-4 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 style={{ color: '#C9A84C', fontFamily: 'Georgia, serif' }} 
              className="text-xl font-bold mb-3">MS Jewellery</h3>
          <p className="text-sm leading-relaxed">
            Prathipadu Mandal, Guntur District<br />
            Andhra Pradesh — 522019
          </p>
          <p className="mt-2 text-sm">
            📞 <a href="tel:+919876543210" className="hover:text-yellow-400">+91 98765 43210</a>
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {['Home', 'Gold Jewelry', 'Silver Jewelry', 'Bridal Collection'].map(l => (
              <li key={l}><a href="#" className="hover:text-yellow-400 transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Timings</h4>
          <p className="text-sm">Mon – Sat: 9:00 AM – 8:00 PM</p>
          <p className="text-sm">Sunday: 10:00 AM – 6:00 PM</p>
          <p className="text-sm mt-3">
            🏅 BIS Hallmarked Jewelry<br />
            💯 Certified Purity Guaranteed
          </p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-600 mt-8 border-t border-gray-800 pt-4">
        © {new Date().getFullYear()} MS Jewellery, Prathipadu. All rights reserved.
      </div>
    </footer>
  );
}

// Inner app with router access
function AppContent() {
  const navigate = useNavigate();
  
  const handleSearch = (query) => {
    navigate(`/catalog?search=${query}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onSearch={handleSearch} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<Catalog />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}