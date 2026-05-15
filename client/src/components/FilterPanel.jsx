// client/src/components/FilterPanel.jsx
import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = ['All', 'Ring', 'Necklace', 'Bracelet', 'Earring', 'Pendant', 
                    'Bangle', 'Anklet', 'Chain', 'Mangalsutra', 'Nose Pin'];
const METAL_TYPES = ['All', 'Gold', 'Silver', 'Gold & Silver'];
const PURITIES = ['All', '24K', '22K', '18K', '14K', '999 Silver', '925 Silver', '950 Silver'];
const GENDERS = ['All', 'Women', 'Men', 'Kids', 'Unisex'];
const OCCASIONS = ['Wedding', 'Festival', 'Daily Wear', 'Party', 'Office', 'Gift'];
const STOCK_STATUS = ['All', 'In Stock', 'Out of Stock', 'Made to Order'];

export default function FilterPanel({ filters, onFilterChange, onClear }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const FilterSection = ({ title, children }) => (
    <div className="mb-5">
      <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">
        {title}
      </h4>
      {children}
    </div>
  );

  const SelectFilter = ({ filterKey, options }) => (
    <select
      value={filters[filterKey] || 'All'}
      onChange={(e) => handleChange(filterKey, e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm 
                 focus:outline-none focus:ring-2 bg-white"
      style={{ '--tw-ring-color': '#C9A84C' }}>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );

  const filterContent = (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <SlidersHorizontal size={18} style={{ color: '#C9A84C' }} />
          Filters
        </h3>
        <button onClick={onClear}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
          <X size={12} /> Clear All
        </button>
      </div>

      <FilterSection title="Category">
        <SelectFilter filterKey="category" options={CATEGORIES} />
      </FilterSection>

      <FilterSection title="Metal Type">
        <div className="flex flex-wrap gap-2">
          {METAL_TYPES.map(type => (
            <button key={type}
                    onClick={() => handleChange('metalType', type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      (filters.metalType || 'All') === type
                        ? 'text-white border-transparent' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-400'
                    }`}
                    style={
                      (filters.metalType || 'All') === type 
                        ? { backgroundColor: '#C9A84C', borderColor: '#C9A84C' }
                        : {}
                    }>
              {type}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Purity">
        <SelectFilter filterKey="purity" options={PURITIES} />
      </FilterSection>

      <FilterSection title="Gender">
        <SelectFilter filterKey="gender" options={GENDERS} />
      </FilterSection>

      <FilterSection title="Occasion">
        <div className="flex flex-wrap gap-1.5">
          {OCCASIONS.map(occ => (
            <button key={occ}
                    onClick={() => handleChange('occasion', 
                      filters.occasion === occ ? '' : occ)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                      filters.occasion === occ
                        ? 'text-white border-transparent'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-300'
                    }`}
                    style={
                      filters.occasion === occ 
                        ? { backgroundColor: '#800020', borderColor: '#800020' }
                        : {}
                    }>
              {occ}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Weight Range (grams)">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minWeight || ''}
            onChange={(e) => handleChange('minWeight', e.target.value)}
            className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm 
                       focus:outline-none focus:ring-1"
            min="0"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxWeight || ''}
            onChange={(e) => handleChange('maxWeight', e.target.value)}
            className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm 
                       focus:outline-none focus:ring-1"
            min="0"
          />
        </div>
      </FilterSection>

      <FilterSection title="Stock Status">
        <SelectFilter filterKey="stockStatus" options={STOCK_STATUS} />
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block sticky top-32">
        {filterContent}
      </div>

      {/* Mobile toggle button */}
      <button onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full 
                         border border-yellow-400 text-sm font-medium"
              style={{ color: '#C9A84C' }}>
        <SlidersHorizontal size={16} /> Filters
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" 
               onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setMobileOpen(false)}>
                <X size={22} className="text-gray-600" />
              </button>
            </div>
            {filterContent}
            <button onClick={() => setMobileOpen(false)}
                    className="w-full py-3 rounded-xl text-white font-bold mt-4"
                    style={{ backgroundColor: '#C9A84C' }}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}