require('dotenv').config();
const express    = require('express');
const cors       = require('cors');

const productsRouter    = require('./routes/products');
const ordersRouter      = require('./routes/orders');
const purchasesRouter   = require('./routes/purchases');
const productionsRouter = require('./routes/productions');

const app  = express();
const PORT = process.env.PORT || 8000;

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/products',    productsRouter);
app.use('/orders',      ordersRouter);
app.use('/purchases',   purchasesRouter);
app.use('/productions', productionsRouter);
app.use('/auth', require('./routes/auth'));

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', port: PORT }));

// ─── 404 FALLBACK ────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` }));

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`POS backend running on http://localhost:${PORT}`);
});
