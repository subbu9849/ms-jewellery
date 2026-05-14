// server/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ─────────────────────────────────────────
// GET /api/products
// Get all products with filtering & search
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const {
      search,        // text search
      category,      // Ring, Necklace, etc.
      metalType,     // Gold, Silver
      purity,        // 22K, 925 Silver, etc.
      minWeight,     // minimum net weight
      maxWeight,     // maximum net weight
      gender,        // Women, Men, Kids
      occasion,      // Wedding, Festival, etc.
      stockStatus,   // In Stock, Out of Stock
      featured,      // true/false
      sortBy,        // name, netWeight, createdAt
      sortOrder,     // asc, desc
      page = 1,
      limit = 12     // 12 products per page
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Text search (searches name and description)
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Metal type filter
    if (metalType && metalType !== 'All') {
      filter.metalType = metalType;
    }

    // Purity filter
    if (purity) {
      filter.purity = purity;
    }

    // Weight range filter
    if (minWeight || maxWeight) {
      filter.netWeight = {};
      if (minWeight) filter.netWeight.$gte = Number(minWeight);
      if (maxWeight) filter.netWeight.$lte = Number(maxWeight);
    }

    // Gender filter
    if (gender && gender !== 'All') {
      filter.gender = gender;
    }

    // Occasion filter
    if (occasion) {
      filter.occasion = { $in: [occasion] };
    }

    // Stock filter
    if (stockStatus) {
      filter.stockStatus = stockStatus;
    }

    // Featured filter
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    // Sort configuration
    const sortConfig = {};
    if (sortBy) {
      sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortConfig.createdAt = -1;  // newest first by default
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort(sortConfig)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / Number(limit)),
        totalProducts: totalCount,
        hasNext: skip + products.length < totalCount,
        hasPrev: Number(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// GET /api/products/:id
// Get a single product by ID
// ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// POST /api/products
// Add a new product
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json({ success: true, data: saved, message: 'Product added successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Validation error', error: error.message });
  }
});

// ─────────────────────────────────────────
// PUT /api/products/:id
// Update a product
// ─────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // returns updated doc, runs validations
    );
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: updated, message: 'Product updated' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating product', error: error.message });
  }
});

// ─────────────────────────────────────────
// DELETE /api/products/:id
// Delete a product (soft delete)
// ─────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    // Soft delete: just marks as inactive instead of removing from database
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// GET /api/products/categories/summary
// Get count of products per category
// ─────────────────────────────────────────
router.get('/meta/categories', async (req, res) => {
  try {
    const summary = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;