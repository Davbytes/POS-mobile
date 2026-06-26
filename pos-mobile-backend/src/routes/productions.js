const express = require('express');
const router  = express.Router();
const { PRODUCTIONS } = require('../data/mockData');

// GET /productions — all production records (optionally date-filtered for reports)
router.get('/', (req, res) => {
  const { from, to } = req.query;
  // Date filter is a no-op on mock data; wire to DB query when ready
  res.json(PRODUCTIONS);
});

module.exports = router;
