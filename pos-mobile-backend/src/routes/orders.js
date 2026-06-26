const express = require('express');
const router  = express.Router();
const { DAILY_SALES } = require('../data/mockData');

// GET /orders/daily — today's sales
router.get('/daily', (req, res) => {
  res.json(DAILY_SALES);
});

// GET /orders/monthly-sales — total for current month
router.get('/monthly-sales', (req, res) => {
  const total = DAILY_SALES.reduce((sum, s) => sum + s.total, 0);
  res.json({ total });
});

// GET /orders/shift-sales — total for current shift (08:00–20:00)
router.get('/shift-sales', (req, res) => {
  const now  = new Date();
  const hour = now.getHours();
  const inShift = hour >= 8 && hour < 20;
  // On mock data we just return the full day total during shift hours
  const total = inShift
    ? DAILY_SALES.reduce((sum, s) => sum + s.total, 0)
    : 0;
  res.json({ total });
});

// GET /orders?from=YYYY-MM-DD&to=YYYY-MM-DD — sales report
router.get('/', (req, res) => {
  // Date filter is a no-op on mock data; wire to DB query when ready
  res.json(DAILY_SALES);
});

module.exports = router;
