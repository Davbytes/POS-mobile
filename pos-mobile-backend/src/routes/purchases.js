const express = require('express');
const router  = express.Router();
const { PURCHASES } = require('../data/mockData');

// GET /purchases — all purchases (optionally date-filtered for reports)
router.get('/', (req, res) => {
  const { from, to } = req.query;
  // Date filter is a no-op on mock data; wire to DB query when ready
  res.json(PURCHASES);
});

// GET /purchases/monthly-total — grand_total sum for current month
router.get('/monthly-total', (req, res) => {
  const total = PURCHASES.reduce((sum, p) => sum + p.grand_total, 0);
  res.json({ total });
});

module.exports = router;
