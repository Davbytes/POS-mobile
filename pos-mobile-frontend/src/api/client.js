// ─── BASE CONFIG ───────────────────────────────────────────────────────────────
//
// BASE_URL options:
//   Android emulator → http://10.0.2.2:8000      (localhost alias for emulator)
//   Physical device  → http://192.168.x.x:8000   (your machine's LAN IP)
//   Production       → https://your-server.com   (deployed central server)
//
// To find your LAN IP on Windows: open Command Prompt → ipconfig
// Look for IPv4 Address under your WiFi adapter.
//
const BASE_URL = 'http://10.0.2.2:8000';

// Set to false to use real API, true to fall back to mock data
// Flip this during development when backend is not running
export const USE_MOCK = false;

// ─── CORE FETCHER ──────────────────────────────────────────────────────────────
async function get(path, params = {}, getToken) {
  // Strip undefined/null params so they don't appear as "?key=undefined" in URL
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v != null)
  );

  const query = new URLSearchParams(cleanParams).toString();
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

// ─── API FACTORY ───────────────────────────────────────────────────────────────
// Usage in screens:
//   const { getToken } = useAuth();
//   const api = createApi(getToken, location?.id);
//
// branchId is passed from LocationContext so every call is branch-scoped.
// The central server filters all queries by branch_id automatically.

function createApi(getToken, branchId) {
  const b = branchId ? { branch_id: branchId } : {};

  return {
    // ── Dashboard ──────────────────────────────────────────────────────────
    getMonthlySales:     ()         => get('/orders/monthly-sales',     b,          getToken),
    getMonthlyPurchases: ()         => get('/purchases/monthly-total',  b,          getToken),
    getShiftSales:       ()         => get('/orders/shift-sales',       b,          getToken),
    getDailySales:       ()         => get('/orders/daily',             b,          getToken),
    getWaiterStats:      ()         => get('/orders/waiter-stats',      b,          getToken),
    getLowStock:         ()         => get('/products/low-stock',       b,          getToken),

    // ── Products ───────────────────────────────────────────────────────────
    getProducts:         ()         => get('/products',                 b,          getToken),

    // ── Production ─────────────────────────────────────────────────────────
    getProductions:      ()         => get('/productions',              b,          getToken),

    // ── Purchases ──────────────────────────────────────────────────────────
    getPurchases:        ()         => get('/purchases',                b,          getToken),

    // ── Reports (date-filtered) ────────────────────────────────────────────
    getSalesReport:      (from, to) => get('/orders',                   { ...b, from, to }, getToken),
    getPurchasesReport:  (from, to) => get('/purchases',                { ...b, from, to }, getToken),
    getProductionReport: (from, to) => get('/productions',              { ...b, from, to }, getToken),
    getProductsReport:   (from, to) => get('/products',                 { ...b, from, to }, getToken),

    // ── Branches (for LocationScreen) ──────────────────────────────────────
    getBranches:         ()         => get('/branches',                 {},         getToken),
  };
}

export default createApi;

// ─── LEGACY EXPORTS (no auth, no branch) ──────────────────────────────────────
// Kept for backward compatibility. Prefer createApi(getToken, branchId) instead.
export const getMonthlySales     = ()         => get('/orders/monthly-sales');
export const getMonthlyPurchases = ()         => get('/purchases/monthly-total');
export const getShiftSales       = ()         => get('/orders/shift-sales');
export const getDailySales       = ()         => get('/orders/daily');
export const getWaiterStats      = ()         => get('/orders/waiter-stats');
export const getLowStock         = ()         => get('/products/low-stock');
export const getProducts         = ()         => get('/products');
export const getProductions      = ()         => get('/productions');
export const getPurchases        = ()         => get('/purchases');
export const getSalesReport      = (from, to) => get('/orders',      { from, to });
export const getPurchasesReport  = (from, to) => get('/purchases',   { from, to });
export const getProductionReport = (from, to) => get('/productions', { from, to });
export const getProductsReport   = (from, to) => get('/products',    { from, to });
export const getBranches         = ()         => get('/branches');
