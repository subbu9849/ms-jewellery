// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────
app.use(cors({
  origin: [process.env.CLIENT_URL, 'https://ms-jewellery.vercel.app'],
  credentials: true
}));
app.use(express.json());  // parse JSON request bodies

// ─────────────────────────────────────────
// DATABASE CONNECTION
// ─────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    seedSampleData();  // add sample products on first run
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// ─────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────
app.use('/api/products', require('./routes/products'));
app.use('/api/prices', require('./routes/prices'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MS Jewellery API is running',
    timestamp: new Date().toISOString()
  });
});

// ─────────────────────────────────────────
// AUTO-UPDATE PRICES EVERY 30 MINUTES
// ─────────────────────────────────────────
cron.schedule('*/30 * * * *', async () => {
  console.log('⏰ Auto-updating metal prices...');
  try {
    const axios = require('axios');
    await axios.get(`http://localhost:${PORT}/api/prices`);
    console.log('✅ Prices updated successfully');
  } catch (err) {
    console.log('⚠️ Price auto-update failed:', err.message);
  }
});

// ─────────────────────────────────────────
// SAMPLE DATA SEEDER
// Adds demo products if database is empty
// ─────────────────────────────────────────
async function seedSampleData() {
  const Product = require('./models/Product');
  const count = await Product.countDocuments();
  
  if (count > 0) {
    console.log(`📦 Database already has ${count} products`);
    return;
  }

  console.log('🌱 Seeding sample jewelry products...');

  const sampleProducts = [
    {
      name: 'Traditional Bridal Necklace Set',
      category: 'Necklace',
      metalType: 'Gold',
      purity: '22K',
      netWeight: 45.5,
      grossWeight: 48.0,
      makingCharges: 800,
      wastagePercent: 12,
      description: 'Exquisite bridal necklace with intricate temple design, featuring peacock motifs and ruby stone setting. Perfect for weddings and special occasions.',
      occasion: ['Wedding', 'Festival'],
      gender: 'Women',
      images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', alt: 'Bridal Necklace' }],
      stockStatus: 'In Stock',
      sku: 'MSJ-GOLD-NECK-001',
      isFeatured: true,
      quantity: 2
    },
    {
      name: 'Antique Temple Earrings',
      category: 'Earring',
      metalType: 'Gold',
      purity: '22K',
      netWeight: 8.2,
      grossWeight: 9.0,
      makingCharges: 650,
      wastagePercent: 10,
      description: 'Traditional Andhra-style temple earrings with goddess motif. Ruby and emerald stone setting with gold polish.',
      occasion: ['Wedding', 'Festival', 'Party'],
      gender: 'Women',
      images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', alt: 'Temple Earrings' }],
      stockStatus: 'In Stock',
      sku: 'MSJ-GOLD-EARR-001',
      isFeatured: true,
      quantity: 5
    },
    {
      name: 'Classic Gold Chain',
      category: 'Chain',
      metalType: 'Gold',
      purity: '22K',
      netWeight: 12.0,
      grossWeight: 12.0,
      makingCharges: 400,
      wastagePercent: 8,
      description: 'Elegant 22K gold chain with Singapore link pattern. Lightweight and perfect for daily wear.',
      occasion: ['Daily Wear', 'Office'],
      gender: 'Women',
      images: [{ url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', alt: 'Gold Chain' }],
      stockStatus: 'In Stock',
      sku: 'MSJ-GOLD-CHAIN-001',
      isFeatured: false,
      quantity: 8
    },
    {
      name: 'Fancy Diamond-Cut Bangle Set',
      category: 'Bangle',
      metalType: 'Gold',
      purity: '22K',
      netWeight: 32.0,
      grossWeight: 32.0,
      makingCharges: 500,
      wastagePercent: 10,
      description: 'Set of 4 diamond-cut bangles with traditional Andhra design. Perfect for bridal trousseau.',
      occasion: ['Wedding', 'Festival'],
      gender: 'Women',
      images: [{ url: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400', alt: 'Gold Bangles' }],
      stockStatus: 'In Stock',
      sku: 'MSJ-GOLD-BANG-001',
      isFeatured: true,
      quantity: 3
    },
    {
      name: 'Silver Anklet Pair',
      category: 'Anklet',
      metalType: 'Silver',
      purity: '925 Silver',
      netWeight: 28.0,
      grossWeight: 30.0,
      makingCharges: 200,
      wastagePercent: 5,
      description: 'Traditional Indian silver anklet pair with ghungroo bells. Perfect for festivals and classical dance.',
      occasion: ['Festival', 'Daily Wear'],
      gender: 'Women',
      images: [{ url: 'https://images.unsplash.com/photo-1601813216775-b73b3ec82c52?w=400', alt: 'Silver Anklets' }],
      stockStatus: 'In Stock',
      sku: 'MSJ-SILV-ANKL-001',
      isFeatured: false,
      quantity: 10
    },
    {
      name: 'Kids Gold Ring',
      category: 'Ring',
      metalType: 'Gold',
      purity: '22K',
      netWeight: 1.5,
      grossWeight: 1.6,
      makingCharges: 350,
      wastagePercent: 8,
      description: 'Cute butterfly design gold ring for kids. Lightweight and durable.',
      occasion: ['Festival', 'Gift'],
      gender: 'Kids',
      images: [{ url: 'https://images.unsplash.com/photo-1608042314453-ae338d682c93?w=400', alt: 'Kids Ring' }],
      stockStatus: 'In Stock',
      sku: 'MSJ-GOLD-RING-001',
      isFeatured: false,
      quantity: 15
    },
    {
      name: 'Mangalsutra — Classic Design',
      category: 'Mangalsutra',
      metalType: 'Gold',
      purity: '22K',
      netWeight: 7.0,
      grossWeight: 7.5,
      makingCharges: 600,
      wastagePercent: 10,
      description: 'Traditional black bead mangalsutra with 22K gold pendant. Available in 18" and 22" lengths.',
      occasion: ['Wedding', 'Daily Wear'],
      gender: 'Women',
      images: [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', alt: 'Mangalsutra' }],
      stockStatus: 'In Stock',
      sku: 'MSJ-GOLD-MANG-001',
      isFeatured: true,
      quantity: 6
    },
    {
      name: 'Silver Pooja Articles Set',
      category: 'Other',
      metalType: 'Silver',
      purity: '999 Silver',
      netWeight: 150.0,
      grossWeight: 155.0,
      makingCharges: 150,
      wastagePercent: 3,
      description: 'Pure silver pooja set including Lakshmi-Ganesha idol, lamp, and serving spoon. Ideal for housewarming and wedding gifts.',
      occasion: ['Festival', 'Gift'],
      gender: 'Unisex',
      images: [{ url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', alt: 'Silver Pooja Set' }],
      stockStatus: 'In Stock',
      sku: 'MSJ-SILV-POOJ-001',
      isFeatured: false,
      quantity: 4
    }
  ];

  await Product.insertMany(sampleProducts);
  console.log(`✅ Seeded ${sampleProducts.length} sample products`);
}

// ─────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║  MS Jewellery Backend Running        ║
  ║  → http://localhost:${PORT}            ║
  ╚══════════════════════════════════════╝
  `);
});