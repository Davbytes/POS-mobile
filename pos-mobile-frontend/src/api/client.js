// ─── BASE CONFIG ───────────────────────────────────────────────────────────────
// When the API is ready, change BASE_URL to the live server address.
// Everything else stays the same.
const BASE_URL = 'http://localhost:8000';

// ─── CORE FETCHER ──────────────────────────────────────────────────────────────
async function get(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url   = `${BASE_URL}${path}${query ? `?${query}` : ''}`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText} — ${url}`);
  }

  return res.json();
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────

/** Total sales amount for the current month. Returns: { total: float } */
export const getMonthlySales = () => get('/orders/monthly-sales');

/** Total purchases grand_total for the current month. Returns: { total: float } */
export const getMonthlyPurchases = () => get('/purchases/monthly-total');

/** Sales total for the current shift (08:00–20:00). Returns: { total: float } */
export const getShiftSales = () => get('/orders/shift-sales');

/**
 * All orders for today.
 * Returns: [{ time, product, qty, unit_price, total, channel, payment, stock_after }]
 */
export const getDailySales = () => get('/orders/daily');

/**
 * Top-selling products by quantity sold.
 * Returns: [{ id, name, category, price, current_sales }]
 */
export const getTopSellers = () => get('/products/top-sellers');

/**
 * Products where stock <= reorder_level.
 * Returns: [{ id, name, stock, reorder_level }]
 */
export const getLowStock = () => get('/products/low-stock');

// ─── PRODUCTS ──────────────────────────────────────────────────────────────────

/**
 * All products.
 * Returns: [{ id, name, category, department, price, stock, reorder_level, current_sales }]
 */
export const getProducts = () => get('/products');

// ─── PRODUCTION ────────────────────────────────────────────────────────────────

/**
 * All production records.
 * Returns: [{ id, product, stock_product, conversion_factor, used_stock, current_stock }]
 */
export const getProductions = () => get('/productions');

// ─── PURCHASES ─────────────────────────────────────────────────────────────────

/**
 * All purchase records.
 * Returns: [{ id, invoice, supplier, received_by, invoice_total, vat_type, total_vat, grand_total, created_at }]
 */
export const getPurchases = () => get('/purchases');

// ─── REPORTS (date-filtered) ───────────────────────────────────────────────────

/**
 * @param {string} from  - e.g. '2024-06-01'
 * @param {string} to    - e.g. '2024-06-30'
 * Returns same shape as getDailySales()
 */
export const getSalesReport      = (from, to) => get('/orders',      { from, to });

/**
 * Returns same shape as getPurchases()
 */
export const getPurchasesReport  = (from, to) => get('/purchases',   { from, to });

/**
 * Returns same shape as getProductions()
 */
export const getProductionReport = (from, to) => get('/productions', { from, to });

/**
 * Returns same shape as getProducts()
 */
export const getProductsReport   = (from, to) => get('/products',    { from, to });
