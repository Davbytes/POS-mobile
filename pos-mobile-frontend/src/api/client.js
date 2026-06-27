// ─── BASE CONFIG ───────────────────────────────────────────────────────────────
const BASE_URL = 'http://10.0.2.2:8000';

// ─── CORE FETCHER ──────────────────────────────────────────────────────────────
async function get(path, params = {}, getToken) {
  const query = new URLSearchParams(params).toString();
  const url   = `${BASE_URL}${path}${query ? `?${query}` : ''}`;

  const token = getToken ? await getToken() : null;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText} — ${url}`);
  }

  return res.json();
}

function createApi(getToken) {
  return {
    getMonthlySales:     () => get('/orders/monthly-sales', {}, getToken),
    getMonthlyPurchases: () => get('/purchases/monthly-total', {}, getToken),
    getShiftSales:       () => get('/orders/shift-sales', {}, getToken),
    getDailySales:       () => get('/orders/daily', {}, getToken),
    getTopSellers:       () => get('/products/top-sellers', {}, getToken),
    getLowStock:         () => get('/products/low-stock', {}, getToken),
    getProducts:         () => get('/products', {}, getToken),
    getProductions:      () => get('/productions', {}, getToken),
    getPurchases:        () => get('/purchases', {}, getToken),
    getSalesReport:      (from, to) => get('/orders', { from, to }, getToken),
    getPurchasesReport:  (from, to) => get('/purchases', { from, to }, getToken),
    getProductionReport: (from, to) => get('/productions', { from, to }, getToken),
    getProductsReport:   (from, to) => get('/products', { from, to }, getToken),
  };
}

export default createApi;

// Legacy exports (no auth) — prefer createApi(getToken) for authenticated calls
export const getMonthlySales     = () => get('/orders/monthly-sales');
export const getMonthlyPurchases = () => get('/purchases/monthly-total');
export const getShiftSales       = () => get('/orders/shift-sales');
export const getDailySales       = () => get('/orders/daily');
export const getTopSellers       = () => get('/products/top-sellers');
export const getLowStock         = () => get('/products/low-stock');
export const getProducts         = () => get('/products');
export const getProductions      = () => get('/productions');
export const getPurchases        = () => get('/purchases');
export const getSalesReport      = (from, to) => get('/orders', { from, to });
export const getPurchasesReport  = (from, to) => get('/purchases', { from, to });
export const getProductionReport = (from, to) => get('/productions', { from, to });
export const getProductsReport   = (from, to) => get('/products', { from, to });
