// client/src/utils/api.js
import axios from 'axios';

// Base URL — points to your backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
});

// ─── Products ────────────────────────────
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getFeaturedProducts = () => api.get('/products', { params: { featured: 'true' } });

// ─── Prices ──────────────────────────────
export const getMetalPrices = () => api.get('/prices');
export const calculatePrice = (params) => api.get('/prices/calculate', { params });

// ─── Format helpers ───────────────────────
export const formatINR = (amount) => 
  new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0 
  }).format(amount);