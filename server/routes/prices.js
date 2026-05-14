// server/routes/prices.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const MetalPrice = require('../models/MetalPrice');

// Gold/Silver price conversion constants
const TOLA_IN_GRAMS = 11.6638;
const USD_TO_INR_FALLBACK = 83.5;  // fallback if currency API fails

// ─────────────────────────────────────────
// Helper: Fetch USD to INR conversion rate
// ─────────────────────────────────────────
async function getUSDtoINR() {
  try {
    // Using free exchangerate-api
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { timeout: 5000 }
    );
    return response.data.rates.INR || USD_TO_INR_FALLBACK;
  } catch {
    console.log('Currency API failed, using fallback rate');
    return USD_TO_INR_FALLBACK;
  }
}

// ─────────────────────────────────────────
// Helper: Fetch Gold/Silver prices from GoldAPI
// ─────────────────────────────────────────
async function fetchFromGoldAPI(usdToINR) {
  const API_KEY = process.env.GOLD_API_KEY;
  
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('GoldAPI key not configured');
  }

  // Fetch gold price (per troy ounce in USD)
  const goldResp = await axios.get('https://www.goldapi.io/api/XAU/USD', {
    headers: { 'x-access-token': API_KEY },
    timeout: 10000
  });
  
  // Fetch silver price (per troy ounce in USD)
  const silverResp = await axios.get('https://www.goldapi.io/api/XAG/USD', {
    headers: { 'x-access-token': API_KEY },
    timeout: 10000
  });

  const TROY_OUNCE_IN_GRAMS = 31.1035;
  
  // Gold price per gram in USD, then convert to INR
  const goldPriceUSD = goldResp.data.price;
  const silverPriceUSD = silverResp.data.price;
  
  const goldPerGram_INR = (goldPriceUSD / TROY_OUNCE_IN_GRAMS) * usdToINR;
  const silverPerGram_INR = (silverPriceUSD / TROY_OUNCE_IN_GRAMS) * usdToINR;

  return { goldPerGram_INR, silverPerGram_INR, goldPriceUSD, silverPriceUSD };
}

// ─────────────────────────────────────────
// GET /api/prices
// Get current gold and silver prices
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // First try to get from database (cached prices, updated every 30 min)
    const cachedPrices = await MetalPrice.find().sort({ updatedAt: -1 }).limit(2);
    
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const pricesAreFresh = cachedPrices.length === 2 && 
                           cachedPrices.every(p => p.updatedAt > thirtyMinutesAgo);
    
    if (pricesAreFresh) {
      // Return cached prices
      return res.json({
        success: true,
        data: cachedPrices,
        cached: true,
        lastUpdated: cachedPrices[0].updatedAt
      });
    }

    // Prices are stale, fetch fresh ones
    const usdToINR = await getUSDtoINR();
    const { goldPerGram_INR, silverPerGram_INR, goldPriceUSD, silverPriceUSD } = 
      await fetchFromGoldAPI(usdToINR);

    // Calculate different purities
    const gold24K = Math.round(goldPerGram_INR);
    const gold22K = Math.round(goldPerGram_INR * (22/24));
    const gold18K = Math.round(goldPerGram_INR * (18/24));

    // Save to database
    await MetalPrice.deleteMany({});  // clear old prices
    
    const goldEntry = await MetalPrice.create({
      metal: 'Gold',
      pricePerGram: gold22K,  // 22K is most common for jewelry
      pricePerTola: Math.round(gold22K * TOLA_IN_GRAMS),
      pricePerOunce: goldPriceUSD,
      purity: '22K',
      source: 'GoldAPI',
      updatedAt: new Date(),
      // Store all purities for reference
      allPurities: { '24K': gold24K, '22K': gold22K, '18K': gold18K }
    });

    const silverEntry = await MetalPrice.create({
      metal: 'Silver',
      pricePerGram: Math.round(silverPerGram_INR),
      pricePerTola: Math.round(silverPerGram_INR * TOLA_IN_GRAMS),
      pricePerOunce: silverPriceUSD,
      purity: '925 Silver',
      source: 'GoldAPI',
      updatedAt: new Date()
    });

    res.json({
      success: true,
      data: [goldEntry, silverEntry],
      cached: false,
      lastUpdated: new Date(),
      exchangeRate: usdToINR
    });

  } catch (error) {
    console.error('Price fetch error:', error.message);
    
    // Return last known prices from database as fallback
    try {
      const lastKnown = await MetalPrice.find().sort({ updatedAt: -1 }).limit(2);
      if (lastKnown.length > 0) {
        return res.json({
          success: true,
          data: lastKnown,
          cached: true,
          fallback: true,
          message: 'Using last known prices (live fetch failed)',
          lastUpdated: lastKnown[0].updatedAt
        });
      }
    } catch {}

    // If everything fails, return hardcoded approximate prices
    res.json({
      success: true,
      data: [
        { metal: 'Gold', pricePerGram: 6800, pricePerTola: 79300, purity: '22K' },
        { metal: 'Silver', pricePerGram: 87, pricePerTola: 1014, purity: '925 Silver' }
      ],
      cached: false,
      fallback: true,
      message: 'Showing approximate prices'
    });
  }
});

// ─────────────────────────────────────────
// GET /api/prices/calculate
// Calculate price for a specific product weight
// ?metal=Gold&purity=22K&weight=10&makingCharges=500
// ─────────────────────────────────────────
router.get('/calculate', async (req, res) => {
  try {
    const { metal, weight, makingCharges = 0, wastagePercent = 0 } = req.query;
    
    if (!metal || !weight) {
      return res.status(400).json({ success: false, message: 'metal and weight are required' });
    }

    const latestPrice = await MetalPrice.findOne({ metal }).sort({ updatedAt: -1 });
    
    if (!latestPrice) {
      return res.status(404).json({ success: false, message: 'Price data not available' });
    }

    const metalCost = latestPrice.pricePerGram * Number(weight);
    const wastage = metalCost * (Number(wastagePercent) / 100);
    const making = Number(makingCharges) * Number(weight);
    const gst = (metalCost + wastage + making) * 0.03;  // 3% GST on jewelry
    const total = metalCost + wastage + making + gst;

    res.json({
      success: true,
      breakdown: {
        metalCost: Math.round(metalCost),
        wastageCharges: Math.round(wastage),
        makingCharges: Math.round(making),
        gst: Math.round(gst),
        totalPrice: Math.round(total)
      },
      metalRate: latestPrice.pricePerGram,
      weight: Number(weight)
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Calculation error', error: error.message });
  }
});

module.exports = router;