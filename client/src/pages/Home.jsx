// client/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Shield, Gem, Truck } from 'lucide-react';
import PriceTicker from '../components/PriceTicker';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts } from '../utils/api';
import { usePrices } from '../hooks/usePrices';

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const { prices } = usePrices();

  useEffect(() => {
    getFeaturedProducts()
      .then(res => setFeatured(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* ─── HERO SECTION ─────────────────── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
               style={{ 
                 background: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #1a0a00 100%)'
               }}>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10"
             style={{ 
               backgroundImage: 'radial-gradient(circle at 20% 50%, #C9A84C 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C9A84C 0%, transparent 50%)'
             }} />

        <div className="relative text-center px-6 max-w-3xl mx-auto">
          <div className="mb-4 text-yellow-400 text-sm tracking-widest uppercase font-medium">
            ✨ Premium Jewelry Store • Prathipadu, Guntur
          </div>
          
          <h1 style={{ fontFamily: 'Georgia, serif', color: '#C9A84C' }}
              className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            MS Jewellery
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-2">
            Adorning Your Every Moment with Excellence
          </p>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Exquisite gold and silver jewelry crafted for weddings, festivals, 
            and everyday elegance. Trusted by families across Andhra Pradesh.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/catalog')}
                    className="px-8 py-3 rounded-full text-white font-bold 
                               flex items-center justify-center gap-2 
                               hover:opacity-90 transition-all text-sm"
                    style={{ backgroundColor: '#C9A84C', color: '#1a0a00' }}>
              Browse Collection <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/catalog?metalType=Silver')}
                    className="px-8 py-3 rounded-full border-2 font-bold 
                               hover:bg-white hover:text-gray-900 transition-all text-sm text-white"
                    style={{ borderColor: '#C9A84C' }}>
              Silver Jewelry
            </button>
          </div>
        </div>
      </section>

      {/* ─── LIVE PRICES ─────────────────── */}
      <PriceTicker />

      {/* ─── CATEGORY QUICK LINKS ─────────────────── */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2" 
              style={{ color: '#1a0a00', fontFamily: 'Georgia, serif' }}>
            Shop by Category
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Discover our wide range of traditional and contemporary jewelry
          </p>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[
              { icon: '💍', label: 'Rings', filter: 'Ring' },
              { icon: '📿', label: 'Necklaces', filter: 'Necklace' },
              { icon: '🔮', label: 'Earrings', filter: 'Earring' },
              { icon: '⭕', label: 'Bangles', filter: 'Bangle' },
              { icon: '🔗', label: 'Chains', filter: 'Chain' },
              { icon: '💒', label: 'Bridal', filter: 'Necklace&occasion=Wedding' },
            ].map(({ icon, label, filter }) => (
              <button key={label}
                      onClick={() => navigate(`/catalog?category=${filter}`)}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl 
                                 hover:bg-yellow-50 border border-transparent 
                                 hover:border-yellow-200 transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {icon}
                </span>
                <span className="text-xs font-medium text-gray-700">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────── */}
      {featured.length > 0 && (
        <section className="py-10 px-4" style={{ backgroundColor: '#FDF8F0' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold" 
                    style={{ color: '#1a0a00', fontFamily: 'Georgia, serif' }}>
                  Featured Collection
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Handpicked pieces for the discerning buyer
                </p>
              </div>
              <button onClick={() => navigate('/catalog')}
                      className="text-sm font-medium flex items-center gap-1 hover:gap-2 
                                 transition-all"
                      style={{ color: '#C9A84C' }}>
                View All <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.slice(0, 4).map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  goldPrice={prices?.Gold?.perGram}
                  silverPrice={prices?.Silver?.perGram}
                  onClick={(p) => navigate(`/catalog/${p._id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── WHY CHOOSE US ─────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" 
              style={{ color: '#1a0a00', fontFamily: 'Georgia, serif' }}>
            Why Choose MS Jewellery?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={28} />, title: 'BIS Hallmarked', desc: 'All gold jewelry is BIS certified for purity' },
              { icon: <Star size={28} />, title: '25+ Years', desc: 'Trusted jeweler serving Guntur district' },
              { icon: <Gem size={28} />, title: 'Custom Designs', desc: 'Made-to-order jewelry for weddings & occasions' },
              { icon: <Truck size={28} />, title: 'Easy Exchange', desc: 'Hassle-free gold exchange policy' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full 
                                mb-3" style={{ backgroundColor: '#FDF8F0', color: '#C9A84C' }}>
                  {icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1 text-sm">{title}</h3>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}