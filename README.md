# POS Mobile — Full Project README

**Project:** Point-of-Sale Mobile App for Restaurant & Hospitality Management
**Student:** Axiom — CIT-227-006/2022, Multimedia University of Kenya
**Stack:** React Native (Expo SDK 51) + Node.js/Express REST API + SQLite (planned)
**Last updated:** 27 Jun 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repo Structure](#2-repo-structure)
3. [Frontend Setup](#3-frontend-setup)
4. [Backend Setup](#4-backend-setup)
5. [How Frontend Talks to Backend](#5-how-frontend-talks-to-backend)
6. [Database Design (for Backend Developer)](#6-database-design-for-backend-developer)
7. [API Reference](#7-api-reference)
8. [Auth Architecture](#8-auth-architecture)
9. [Connecting Frontend to Real Backend](#9-connecting-frontend-to-real-backend)
10. [Known Issues & Workarounds](#10-known-issues--workarounds)
11. [What Still Needs Doing](#11-what-still-needs-doing)

---

## 1. Project Overview

A React Native / Expo mobile app for restaurant owners to monitor their business
across multiple branches from a single phone. The owner logs in once and can switch
between branches without signing out.

**Five main screens:**
- **Dashboard** — stat cards (monthly sales, purchases, shift sales, low stock), daily
  sales transactions, waiter performance ranking (by revenue + units sold), low stock alerts
- **Products** — filterable product list (by category: Food/Beverages/Alcohol and
  department: Kitchen/Bar)
- **Production** — records showing what raw materials were used and current stock levels
- **Purchases** — supplier invoices with VAT breakdown
- **Reports** — sub-tabbed (Sales / Purchases / Production / Products) with date filters

**Design:** Blue (`#2563eb`) and white throughout.

**Auth:** Clerk (`@clerk/clerk-expo@0.20.36`) handles sign-up and sign-in. The backend
also ships its own JWT auth (`/auth/register`, `/auth/login`) as a fallback if Clerk is
ever replaced.

---

## 2. Repo Structure

There are two separate repos:

```
pos-mobile-frontend/          ← React Native app (this is what runs on the phone)
pos-mobile-backend/           ← Node.js/Express REST API (runs on a server or dev machine)
```

They communicate over HTTP. The frontend calls the backend's REST endpoints.
The backend currently uses mock data — it is structured exactly so that a database
developer can swap each mock array for a real DB query without touching the frontend.

---

## 3. Frontend Setup

### Requirements
- Node.js 18+
- Expo Go app installed on Android/iOS device
- A Clerk account (free) at https://clerk.com

### Steps

```bash
# 1. Clone / copy the folder
cd pos-mobile-frontend

# 2. Install Expo-managed dependencies
npx expo install

# 3. Install Clerk — version must be exactly 0.20.36
npm install @clerk/clerk-expo@0.20.36 --legacy-peer-deps

# 4. Create assets folder (required by Expo)
mkdir assets
# Add icon.png, splash.png, adaptive-icon.png (any PNG works for dev)

# 5. Create .env file
echo "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_..." > .env
# Get the key from: Clerk Dashboard → API Keys → Publishable key

# 6. Start
npx expo start --clear
# Scan the QR code with Expo Go
```

### Clerk Dashboard Settings (CRITICAL — must be set exactly)

Go to https://dashboard.clerk.com → Configure → User & Authentication

**Email settings:**
| Setting | Value |
|---|---|
| Sign-up with email | ✅ ON |
| Require email address | ✅ ON |
| Verify at sign-up | ❌ OFF |
| Sign-in with email | ✅ ON |
| Email verification code | ❌ OFF |
| Email verification link | ❌ OFF |

**Password settings:**
| Setting | Value |
|---|---|
| Password-based authentication | ✅ ON |

> **Why verification is OFF:** `@clerk/clerk-expo@0.20.36` has a bug where email
> verification token handling throws a base64 error. Disabling verification bypasses it.
> Do not upgrade Clerk past `0.20.36` — v1.x requires React 19 which breaks Expo SDK 51.

### Critical Rules — Never Do These

| Rule | Reason |
|---|---|
| Never `npm audit fix --force` | Breaks peer dependency tree |
| Never `npm update` | Upgrades locked packages |
| Never upgrade Expo SDK from 51 | All package versions locked |
| Never install `@clerk/expo` or `@clerk/clerk-expo` v1.x+ | Requires React 19 |
| Never install real `react-dom` package | Causes duplicate React → hook crash |
| Never upgrade React Navigation to v7 | Needs react-native-screens ≥ 4.0.0 |

---

## 4. Backend Setup

### Requirements
- Node.js 18+

### Steps

```bash
cd pos-mobile-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env — set PORT and JWT_SECRET at minimum

# Start in development (auto-restarts on file change)
npm run dev

# Or start in production
npm start
```

### .env variables

```env
PORT=8000
JWT_SECRET=change_this_to_a_long_random_string_in_production

# When you add a database, add its connection string here:
# DB_PATH=./pos.db          ← for SQLite
# DB_URI=postgres://...     ← for PostgreSQL
```

### Verify it's running

```bash
curl http://localhost:8000/health
# Expected: {"status":"ok","port":8000}

curl http://localhost:8000/products
# Expected: JSON array of products
```

---

## 5. How Frontend Talks to Backend

The frontend's API layer is in `src/api/`:

```
src/api/
├── client.js     ← base URL + GET helper function
├── useFetch.js   ← React hook that calls client.js and manages loading/error state
└── tokenCache.js ← Clerk session storage (SecureStore)
```

**`src/api/client.js`** — the only file you need to change to point at a real server:

```js
// Current (mock mode — each screen imports from mockData.js directly)
const BASE_URL = 'http://localhost:8000';

// Change this to your backend machine's LAN IP when running on a real device:
const BASE_URL = 'http://192.168.1.XX:8000';
```

To find your machine's LAN IP on Windows: open Command Prompt → `ipconfig` →
look for **IPv4 Address** under your WiFi adapter (e.g. `192.168.1.45`).

**`src/api/useFetch.js`** — generic hook used by screens:

```js
const { data, loading, error } = useFetch('/products');
// data   → parsed JSON response
// loading → true while request is in flight
// error   → error message string if request failed
```

---

## 6. Database Design (for Backend Developer)

The backend currently uses in-memory mock arrays in `src/data/mockData.js`.
To connect a real database, replace each array with a DB query in the corresponding
route file. The field names must stay the same — the frontend expects these exact keys.

### Recommended: SQLite (via `better-sqlite3`)

SQLite is the simplest choice for a single-server deployment. No separate DB process needed.

```bash
npm install better-sqlite3
```

### Tables

#### `users`
```sql
CREATE TABLE users (
  id         TEXT PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,         -- bcrypt hash
  created_at TEXT DEFAULT (datetime('now'))
);
```

#### `branches` (maps to LOCATIONS in frontend)
```sql
CREATE TABLE branches (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

#### `products`
```sql
CREATE TABLE products (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,     -- 'Food' | 'Beverages' | 'Alcohol'
  department    TEXT NOT NULL,     -- 'Kitchen' | 'Bar'
  price         REAL NOT NULL,
  stock         INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 0,
  current_sales INTEGER NOT NULL DEFAULT 0,
  branch_id     INTEGER REFERENCES branches(id)
);
```

#### `orders` (maps to DAILY_SALES)
```sql
CREATE TABLE orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER REFERENCES products(id),
  product     TEXT NOT NULL,       -- denormalised name for display
  qty         INTEGER NOT NULL,
  unit_price  REAL NOT NULL,
  total       REAL NOT NULL,
  channel     TEXT NOT NULL,       -- e.g. 'Waiter – Jane M.'
  payment     TEXT NOT NULL,       -- 'Cash' | 'Card' | 'M-Pesa'
  stock_after INTEGER,
  branch_id   INTEGER REFERENCES branches(id),
  created_at  TEXT DEFAULT (datetime('now')),
  time        TEXT                 -- HH:MM display string
);
```

#### `purchases`
```sql
CREATE TABLE purchases (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice       TEXT NOT NULL,
  supplier      TEXT NOT NULL,
  received_by   TEXT NOT NULL,
  invoice_total REAL NOT NULL,
  vat_type      TEXT NOT NULL,     -- 'Inclusive' | 'Exclusive'
  total_vat     REAL NOT NULL,
  grand_total   REAL NOT NULL,
  branch_id     INTEGER REFERENCES branches(id),
  created_at    TEXT DEFAULT (datetime('now'))
);
```

#### `productions`
```sql
CREATE TABLE productions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  product       TEXT NOT NULL,
  stock_product TEXT NOT NULL,     -- raw material name
  used_stock    REAL NOT NULL,
  current_stock REAL NOT NULL,
  branch_id     INTEGER REFERENCES branches(id),
  created_at    TEXT DEFAULT (datetime('now'))
);
```

#### `waiters` (optional — for proper waiter ranking)
```sql
CREATE TABLE waiters (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NOT NULL,
  branch_id INTEGER REFERENCES branches(id)
);
```

### Replacing Mock Data with DB Queries (example)

In `src/routes/products.js`, replace:
```js
const { PRODUCTS } = require('../data/mockData');
router.get('/', (req, res) => res.json(PRODUCTS));
```

With:
```js
const db = require('../db');   // your better-sqlite3 connection
router.get('/', (req, res) => {
  const { branch_id } = req.query;
  const rows = db.prepare(
    'SELECT * FROM products WHERE branch_id = ?'
  ).all(branch_id ?? 1);
  res.json(rows);
});
```

Do the same pattern for each route file. The frontend will work immediately
because the JSON field names match what the screens expect.

---

## 7. API Reference

All endpoints return JSON. The frontend calls these from `src/api/client.js`.

### Auth (backend's own JWT — not Clerk)

| Method | Endpoint | Body | Returns |
|---|---|---|---|
| POST | `/auth/register` | `{ email, password }` | `{ token, user }` |
| POST | `/auth/login` | `{ email, password }` | `{ token, user }` |

### Orders (Daily Sales)

| Method | Endpoint | Query Params | Returns |
|---|---|---|---|
| GET | `/orders/daily` | — | `[{ time, product, qty, unit_price, total, channel, payment, stock_after }]` |
| GET | `/orders/monthly-sales` | — | `{ total: float }` |
| GET | `/orders/shift-sales` | — | `{ total: float }` |
| GET | `/orders` | `from=YYYY-MM-DD&to=YYYY-MM-DD` | filtered orders array |

### Products

| Method | Endpoint | Query Params | Returns |
|---|---|---|---|
| GET | `/products` | `from=`, `to=` | `[{ id, name, category, department, price, stock, reorder_level, current_sales }]` |
| GET | `/products/top-sellers` | — | same as above, sorted by `current_sales` desc |
| GET | `/products/low-stock` | — | products where `stock <= reorder_level` |

### Purchases

| Method | Endpoint | Query Params | Returns |
|---|---|---|---|
| GET | `/purchases` | `from=`, `to=` | `[{ id, invoice, supplier, received_by, invoice_total, vat_type, total_vat, grand_total, created_at }]` |
| GET | `/purchases/monthly-total` | — | `{ total: float }` |

### Productions

| Method | Endpoint | Query Params | Returns |
|---|---|---|---|
| GET | `/productions` | `from=`, `to=` | `[{ id, product, stock_product, used_stock, current_stock }]` |

> **Note:** The waiter ranking endpoint is not yet implemented. Currently the frontend
> derives `WAITER_STATS` by aggregating the `channel` field from `/orders/daily`.
> When moving to a real DB, add a `GET /orders/waiter-stats` endpoint that returns
> `[{ name, revenue, units }]` sorted by revenue descending.

---

## 8. Auth Architecture

The project has two auth systems — understand which does what:

### Clerk (frontend auth — handles login UI)
- Manages the sign-in / sign-up flow in the mobile app
- Stores the session token in `expo-secure-store` via `src/api/tokenCache.js`
- `useAuth()` hook gives `isSignedIn`, `signOut()`, `getToken()`
- The Clerk publishable key goes in `.env` as `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Backend JWT (API auth — protects data endpoints)
- `POST /auth/register` and `POST /auth/login` return a JWT signed with `JWT_SECRET`
- Currently the data endpoints (`/products`, `/orders`, etc.) are **unprotected**
- When ready to secure them, add middleware to `server.js`:

```js
// src/middleware/requireAuth.js
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// In server.js — apply to all data routes:
const requireAuth = require('./middleware/requireAuth');
app.use('/products',    requireAuth, productsRouter);
app.use('/orders',      requireAuth, ordersRouter);
app.use('/purchases',   requireAuth, purchasesRouter);
app.use('/productions', requireAuth, productionsRouter);
```

Then in `src/api/client.js` on the frontend, attach the token:

```js
import { useAuth } from '@clerk/clerk-expo';

// Inside your API calls:
const { getToken } = useAuth();
const token = await getToken();
const res = await fetch(`${BASE_URL}/products`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

> For now, if using Clerk as the only auth, you can pass the Clerk session JWT
> as the bearer token and verify it on the backend using `@clerk/clerk-sdk-node`
> instead of `jsonwebtoken`. The backend's own JWT auth can be removed in that case.

---

## 9. Connecting Frontend to Real Backend

When the backend is running and the database is connected, follow these steps to
wire the frontend to real data. Do this one screen at a time so you can test as you go.

### Step 1 — Set the backend URL

In `src/api/client.js`:
```js
// Change this line:
const BASE_URL = 'http://localhost:8000';
// To your machine's LAN IP (phone and computer must be on same WiFi):
const BASE_URL = 'http://192.168.1.XX:8000';
```

### Step 2 — Replace mock imports in each screen

Currently each screen does:
```js
import { DAILY_SALES, WAITER_STATS, LOW_STOCK, ... } from '../data/mockData';
```

Replace with `useFetch` calls. Example for DashboardScreen:

```js
// Before (mock):
import { DAILY_SALES, WAITER_STATS, LOW_STOCK, TOTAL_MONTHLY_SALES } from '../data/mockData';

// After (real API):
import { useFetch } from '../api/useFetch';

export default function DashboardScreen() {
  const { data: dailySales,   loading: l1 } = useFetch('/orders/daily');
  const { data: monthlySales, loading: l2 } = useFetch('/orders/monthly-sales');
  const { data: shiftSales,   loading: l3 } = useFetch('/orders/shift-sales');
  const { data: lowStock,     loading: l4 } = useFetch('/products/low-stock');
  const { data: waiterStats,  loading: l5 } = useFetch('/orders/waiter-stats');

  if (l1 || l2 || l3 || l4 || l5) return <LoadingSpinner />;
  // ... rest of component using real data
}
```

### Step 3 — Add branch filtering

The owner switches branches in the drawer. Pass the current branch ID to each API call
so the backend can filter data by branch:

```js
const { location } = useLocation();  // current branch from context

const { data: products } = useFetch(`/products?branch_id=${location?.id}`);
```

### Step 4 — Test the full flow

1. Start backend: `npm run dev` in `pos-mobile-backend/`
2. Start frontend: `npx expo start --clear` in `pos-mobile-frontend/`
3. Sign in → select branch → verify Dashboard shows real data
4. Switch branch in drawer → verify data updates to new branch

---

## 10. Known Issues & Workarounds

### Clerk base64 crash (RESOLVED)
**Error:** `Not a valid base64 encoded string length` on sign-up/sign-in
**Fix:** `src/shims/base64Patch.js` — patches `globalThis.atob` with a lenient decoder.
Imported as the last line in `App.js` so it runs after Clerk's polyfill installs.
Do not remove this file or move the import.

### `[Clerk] setActive non-fatal` warning (KNOWN — safe to ignore)
**Warning:** `Cannot read property 'location' of null`
Clerk tries to call `window.location` (browser API) during session activation.
Expected on React Native. Does not affect functionality.

### react-dom bundling error (RESOLVED)
**Error:** `Unable to resolve "react-dom"`
**Fix:** `src/shims/react-dom-shim.js` + `metro.config.js` resolver alias.
Clerk's internal web-only code imports react-dom; the shim satisfies Metro without
pulling in the real package (which would create a duplicate React copy and crash hooks).

### Drawer hooks crash (RESOLVED)
**Error:** `Invalid hook call` / `useContext null`
**Fix:** All hooks must be inside the component function. `DrawerContent.js` guards
`locationCtx` and `state` before rendering: `if (!locationCtx || !state) return null`.

---

## 11. What Still Needs Doing

- [ ] **Connect to real database** — replace `src/data/mockData.js` in the backend
      with SQLite queries using `better-sqlite3`. Schema in Section 6 above.
- [ ] **Add branch filtering to all API endpoints** — accept `branch_id` query param
      and filter all DB queries by it.
- [ ] **Add waiter stats endpoint** — `GET /orders/waiter-stats` returning
      `[{ name, revenue, units }]` aggregated from the orders table.
- [ ] **Wire frontend to backend** — update `BASE_URL` in `src/api/client.js` and
      replace mockData imports in each screen with `useFetch` calls (Section 9).
- [ ] **Protect API endpoints** — add JWT middleware to all data routes (Section 8).
- [ ] **Test full branch-switching flow** — owner selects branch in drawer, all
      screens reload with data filtered to that branch.
- [ ] **Test production build** — run `eas build` and verify `base64Patch.js` shim
      works in a standalone (non-Expo-Go) build.
- [ ] **Reports screen date filtering** — wire `from`/`to` query params to actual
      API calls (currently a no-op on mock data).
