const express = require('express');
const router  = express.Router();
const { PRODUCTS } = require('../data/mockData');

// GET /products — all products (optionally date-filtered for reports)
router.get('/', (req, res) => {
  const { from, to } = req.query;
  // Date filter is a no-op on mock data; wire to DB query when ready
  res.json(PRODUCTS);
});

// GET /products/top-sellers — sorted by current_sales desc
router.get('/top-sellers', (req, res) => {
  const sorted = [...PRODUCTS].sort((a, b) => b.current_sales - a.current_sales);
  res.json(sorted);
});

// GET /products/low-stock — where stock <= reorder_level
router.get('/low-stock', (req, res) => {
  const low = PRODUCTS.filter(p => p.stock <= p.reorder_level);
  res.json(low);
});

module.exports = router;
