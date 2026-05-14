// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  // Jewelry Category
  category: {
    type: String,
    required: true,
    enum: ['Ring', 'Necklace', 'Bracelet', 'Earring', 'Pendant', 
           'Bangle', 'Anklet', 'Chain', 'Mangalsutra', 'Nose Pin', 'Other']
  },
  
  // Metal Details
  metalType: {
    type: String,
    required: true,
    enum: ['Gold', 'Silver', 'Gold & Silver']
  },
  
  purity: {
    type: String,
    // Gold: 24K, 22K, 18K, 14K | Silver: 999, 925, 950
    enum: ['24K', '22K', '18K', '14K', '999 Silver', '925 Silver', '950 Silver', 'Mixed'],
  },
  
  // Weight
  netWeight: {
    type: Number,  // in grams
    required: true,
    min: [0.1, 'Weight must be at least 0.1 grams']
  },
  grossWeight: {
    type: Number,  // total weight including stones
    required: true
  },
  
  // Pricing
  makingCharges: {
    type: Number,  // in rupees per gram
    default: 0
  },
  wastagePercent: {
    type: Number,  // wastage percentage
    default: 0
  },
  // Note: Final price is calculated dynamically using live gold/silver rate
  fixedPrice: {
    type: Number,  // optional fixed price (overrides dynamic calculation)
    default: null
  },
  
  // Product Details
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  occasion: {
    type: [String],
    enum: ['Wedding', 'Festival', 'Daily Wear', 'Party', 'Office', 'Gift']
  },
  gender: {
    type: String,
    enum: ['Women', 'Men', 'Kids', 'Unisex'],
    default: 'Women'
  },
  
  // Images
  images: [{
    url: String,     // image URL (from Cloudinary or similar)
    alt: String
  }],
  
  // Inventory
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Made to Order'],
    default: 'In Stock'
  },
  quantity: {
    type: Number,
    default: 1
  },
  
  // Business
  sku: {
    type: String,
    unique: true,
    // e.g., MSJ-GOLD-RING-001
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
}, { timestamps: true });  // Automatically adds createdAt and updatedAt

// Index for faster search
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, metalType: 1 });
productSchema.index({ netWeight: 1 });

module.exports = mongoose.model('Product', productSchema);