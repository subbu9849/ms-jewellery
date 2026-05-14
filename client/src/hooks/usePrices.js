// client/src/hooks/usePrices.js
import { useState, useEffect } from 'react';
import { getMetalPrices } from '../utils/api';

export function usePrices() {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchPrices = async () => {
    try {
      const response = await getMetalPrices();
      const data = response.data.data;
      
      // Organize into a convenient object
      const priceMap = {};
      data.forEach(item => {
        priceMap[item.metal] = {
          perGram: item.pricePerGram,
          perTola: item.pricePerTola,
          purity: item.purity,
        };
      });
      
      setPrices(priceMap);
      setLastUpdated(new Date(response.data.lastUpdated));
      setError(null);
    } catch (err) {
      setError('Could not fetch live prices');
      // Use fallback prices
      setPrices({
        Gold: { perGram: 6800, perTola: 79300, purity: '22K' },
        Silver: { perGram: 87, perTola: 1014, purity: '925 Silver' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchPrices, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, lastUpdated, error, refetch: fetchPrices };
}