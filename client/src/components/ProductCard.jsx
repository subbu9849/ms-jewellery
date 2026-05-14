// client/src/components/ProductCard.jsx
import { useState } from 'react';
import { Tag, Scale, Eye } from 'lucide-react';
import { formatINR } from '../utils/api';

export default function ProductCard({ product, goldPrice, silverPrice, onClick }) {
  const [imgError, setImgError] = useState(false);

  // Calculate estimated price based on live rates
  const calculatePrice = () => {
    if (product.fixedPrice) return product.fixedPrice;

    const baseRate = product.metalType === 'Silver' ? silverPrice : goldPrice;
    if (!baseRate) return null;

    const metalCost = baseRate * product.netWeight;
    const wastage = metalCost * (product.wastagePercent / 100);
    const making = product.makingCharges * product.netWeight;
    const gst = (metalCost + wastage + making) * 0.03;
    return Math.round(metalCost + wastage + making + gst);
  };

  const estimatedPrice = calculatePrice();
  const imageUrl = (!imgError && product.images?.[0]?.url) 
    ? product.images[0].url 
    : `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400`;

  return (
    <div onClick={() => onClick?.(product)}
         className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
                    transition-all duration-300 cursor-pointer hover:-translate-y-1 border
                    border-yellow-100">
      
      {/* Product Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={imageUrl}
          alt={product.images?.[0]?.alt || product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform 
                     duration-500"
        />
        
        {/* Featured badge */}
        {product.isFeatured && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full"
                style={{ backgroundColor: '#C9A84C', color: '#1a0a00' }}>
            ⭐ Featured
          </span>
        )}

        {/* Stock badge */}
        {product.stockStatus !== 'In Stock' && (
          <span className="absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full 
                           bg-red-100 text-red-700">
            {product.stockStatus}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 
                        transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white 
                           text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium 
                           flex items-center gap-1">
            <Eye size={14} /> View Details
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Category + Metal */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 
                           px-2 py-0.5 rounded-full">
            <Tag size={10} /> {product.category}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            product.metalType === 'Gold' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-gray-200 text-gray-700'
          }`}>
            {product.purity || product.metalType}
          </span>
        </div>

        {/* Weight */}
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <Scale size={12} />
          <span>{product.netWeight}g net / {product.grossWeight}g gross</span>
        </div>

        {/* Price */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          {estimatedPrice ? (
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Est. Price (incl. GST)</div>
              <div className="font-bold text-lg" style={{ color: '#C9A84C' }}>
                {formatINR(estimatedPrice)}
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Price on request</div>
          )}
        </div>
      </div>
    </div>
  );
}