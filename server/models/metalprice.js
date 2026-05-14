// server/models/MetalPrice.js
const mongoose = require('mongoose');

const metalPriceSchema = new mongoose.Schema({
  metal: {
    type: String,
    enum: ['Gold', 'Silver'],
    required: true
  },
  pricePerGram: {
    type: Number,  // in INR
    required: true
  },
  pricePerTola: {
    type: Number,  // 1 tola = 11.6638 grams
  },
  pricePerOunce: {
    type: Number,  // in USD (raw from API)
  },
  purity: {
    type: String,
    // e.g., "22K", "24K", "925 Silver"
  },
  source: {
    type: String,
    default: 'GoldAPI'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MetalPrice', metalPriceSchema);