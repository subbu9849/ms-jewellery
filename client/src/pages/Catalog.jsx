// client/src/pages/Catalog.jsx
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import { usePrices } from '../hooks/usePrices';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'netWeight-asc', label: 'Weight: Low to High' },
  { value: 'netWeight-desc', label: 'Weight: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { prices } = usePrices();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortValue, setSortValue] = useState('createdAt-desc');

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    metalType: searchParams.get('metalType') || 'All',
    purity: searchParams.get('purity') || 'All',
    gender: searchParams.get('gender') || 'All',
    occasion: searchParams.get('occasion') || '',
    minWeight: searchParams.get('minWeight') || '',
    maxWeight: searchParams.get('maxWeight') || '',
    stockStatus: searchParams.get('stockStatus') || 'All',
    search: searchParams.get('search') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [sortBy, sortOrder] = sortValue.split('-');
      
      // Build clean params (exclude 'All' values)
      const params = { page: currentPage, limit: 12, sortBy, sortOrder };
      Object.entries(filters).forEach(([key, val]) => {
        if (val && val !== 'All') params[key] = val;
      });

      const res = await getProducts(params);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, sortValue]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      category: 'All', metalType: 'All', purity: 'All', gender: 'All',
      occasion: '', minWeight: '', maxWeight: '', stockStatus: 'All', search: ''
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F0' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" 
              style={{ color: '#1a0a00', fontFamily: 'Georgia, serif' }}>
            Jewelry Collection
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {pagination ? `${pagination.totalProducts} products found` : 'Loading...'}
          </p>
        </div>

        <div className="flex gap-6">
          
          {/* ─── FILTER PANEL ─── */}
          <aside className="w-64 shrink-0">
            <FilterPanel 
              filters={filters} 
              onFilterChange={setFilters}
              onClear={clearFilters}
            />
          </aside>

          {/* ─── PRODUCT GRID ─── */}
          <main className="flex-1 min-w-0">
            
            {/* Sort + mobile filter */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <FilterPanel 
                filters={filters} 
                onFilterChange={setFilters}
                onClear={clearFilters}
              />
              
              <select value={sortValue} onChange={e => setSortValue(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm 
                                 bg-white focus:outline-none focus:ring-1">
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader size={32} className="animate-spin" style={{ color: '#C9A84C' }} />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">💍</div>
                <h3 className="font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                <button onClick={clearFilters}
                        className="mt-4 px-4 py-2 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: '#C9A84C' }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    goldPrice={prices?.Gold?.perGram}
                    silverPrice={prices?.Silver?.perGram}
                    onClick={(p) => navigate(`/catalog/${p._id}`)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed 
                             hover:bg-yellow-50 transition-colors">
                  <ChevronLeft size={18} />
                </button>
                
                <span className="text-sm text-gray-600 px-4">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!pagination.hasNext}
                  className="p-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed 
                             hover:bg-yellow-50 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}