// client/src/components/PriceTicker.jsx
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { usePrices } from '../hooks/usePrices';
import { formatINR } from '../utils/api';

export default function PriceTicker() {
  const { prices, loading, lastUpdated, error, refetch } = usePrices();

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="py-6 px-4" style={{ backgroundColor: '#1a0a00' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ color: '#C9A84C' }} 
              className="text-lg font-bold tracking-wider uppercase flex items-center gap-2">
            <span>📊</span> Today's Market Rates
          </h2>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-gray-400 text-xs">
                Updated: {formatTime(lastUpdated)}
              </span>
            )}
            <button onClick={refetch}
                    className="text-gray-400 hover:text-yellow-400 transition-colors p-1"
                    title="Refresh prices">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Price Cards */}
        {loading ? (
          <div className="text-center text-gray-400 py-4">Loading live prices...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 22K Gold */}
            <PriceCard
              icon="🥇"
              title="Gold (22K)"
              subtitle="Most Common for Jewelry"
              perGram={prices?.Gold?.perGram}
              perTola={prices?.Gold?.perTola}
              color="#C9A84C"
            />

            {/* 24K Gold */}
            <PriceCard
              icon="✨"
              title="Gold (24K)"
              subtitle="Pure / Investment"
              perGram={prices?.Gold ? Math.round(prices.Gold.perGram * 24 / 22) : null}
              perTola={prices?.Gold ? Math.round(prices.Gold.perTola * 24 / 22) : null}
              color="#FFD700"
            />

            {/* 925 Silver */}
            <PriceCard
              icon="🥈"
              title="Silver (925)"
              subtitle="Standard Jewelry Silver"
              perGram={prices?.Silver?.perGram}
              perTola={prices?.Silver?.perTola}
              color="#C0C0C0"
            />

            {/* 999 Silver */}
            <PriceCard
              icon="💠"
              title="Silver (999)"
              subtitle="Pure Silver / Pooja Items"
              perGram={prices?.Silver ? Math.round(prices.Silver.perGram * 1.05) : null}
              perTola={prices?.Silver ? Math.round(prices.Silver.perTola * 1.05) : null}
              color="#A8A9AD"
            />
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-gray-500 text-xs mt-3 text-center">
          * Prices are indicative and include approximate making charges. 
          Final price depends on weight and design. GST extra. 
          {error && <span className="text-yellow-600"> (Showing approximate values)</span>}
        </p>
      </div>
    </section>
  );
}

// ─── Sub-component: individual price card ───────────────
function PriceCard({ icon, title, subtitle, perGram, perTola, color }) {
  return (
    <div className="rounded-xl p-4 border transition-transform hover:scale-105"
         style={{ backgroundColor: '#2a1500', borderColor: color + '40' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="font-bold text-white text-sm">{title}</div>
          <div className="text-gray-400 text-xs">{subtitle}</div>
        </div>
      </div>
      
      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Per Gram</span>
          <span className="font-bold text-base" style={{ color }}>
            {perGram ? formatINR(perGram) : '—'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs">Per Tola (10g)</span>
          <span className="text-gray-300 text-sm">
            {perTola ? formatINR(perTola) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}