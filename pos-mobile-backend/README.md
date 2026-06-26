# POS Mobile — Backend

Express.js REST API that serves the `pos-mobile` React Native frontend.

## Setup

```bash
npm install
cp .env.example .env   # edit PORT if needed
npm run dev            # nodemon auto-reload
# or
npm start              # plain node
```

Server starts on **http://localhost:8000** by default.

## API Endpoints

### Orders / Sales
| Method | Path | Description |
|--------|------|-------------|
| GET | `/orders/daily` | Today's sales rows |
| GET | `/orders/monthly-sales` | `{ total }` for current month |
| GET | `/orders/shift-sales` | `{ total }` for current shift (08:00–20:00) |
| GET | `/orders?from=YYYY-MM-DD&to=YYYY-MM-DD` | Sales report (date range) |

### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/products` | All products |
| GET | `/products/top-sellers` | Sorted by `current_sales` desc |
| GET | `/products/low-stock` | Where `stock <= reorder_level` |
| GET | `/products?from=&to=` | Products report (date range) |

### Purchases
| Method | Path | Description |
|--------|------|-------------|
| GET | `/purchases` | All purchases |
| GET | `/purchases/monthly-total` | `{ total }` of `grand_total` for current month |
| GET | `/purchases?from=&to=` | Purchases report (date range) |

### Productions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/productions` | All production records |
| GET | `/productions?from=&to=` | Production report (date range) |

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | `{ status: "ok" }` |

## Project Structure

```
pos-mobile-backend/
├── src/
│   ├── server.js          ← entry point, mounts all routes
│   ├── data/
│   │   └── mockData.js    ← in-memory mock data (replace with DB queries)
│   └── routes/
│       ├── orders.js
│       ├── products.js
│       ├── purchases.js
│       └── productions.js
├── .env.example
├── package.json
└── README.md
```

## Connecting a Real Database

1. Add your DB driver (`mongoose`, `pg`, etc.) to `package.json`.
2. Add the connection string to `.env`.
3. Replace the array imports in each route file with real DB queries.
4. The route handlers and URL structure stay the same — the frontend won't need changes.
