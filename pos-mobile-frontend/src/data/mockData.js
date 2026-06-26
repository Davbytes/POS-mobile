// ─── LOCATIONS ────────────────────────────────────────────────────────────────
export const LOCATIONS = [
  { id: 1, name: "Main Branch – Nairobi CBD" },
  { id: 2, name: "Westlands Branch" },
  { id: 3, name: "Karen Branch" },
  { id: 4, name: "Mombasa Branch" },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  { id: 1, name: "Mineral Water 500ml", category: "Beverages", department: "Bar",     price: 50,   stock: 120, reorder_level: 30, current_sales: 340 },
  { id: 2, name: "Beef Burger",         category: "Food",      department: "Kitchen", price: 650,  stock: 8,   reorder_level: 15, current_sales: 89  },
  { id: 3, name: "Tusker Lager 500ml",  category: "Alcohol",   department: "Bar",     price: 300,  stock: 48,  reorder_level: 24, current_sales: 210 },
  { id: 4, name: "Grilled Chicken",     category: "Food",      department: "Kitchen", price: 850,  stock: 5,   reorder_level: 10, current_sales: 55  },
  { id: 5, name: "Krest Bitter Lemon",  category: "Beverages", department: "Bar",     price: 80,   stock: 96,  reorder_level: 20, current_sales: 180 },
  { id: 6, name: "Tilapia Fillet",      category: "Food",      department: "Kitchen", price: 1200, stock: 3,   reorder_level: 8,  current_sales: 32  },
  { id: 7, name: "Pilsner Urquell",     category: "Alcohol",   department: "Bar",     price: 350,  stock: 60,  reorder_level: 24, current_sales: 95  },
  { id: 8, name: "Caesar Salad",        category: "Food",      department: "Kitchen", price: 550,  stock: 14,  reorder_level: 10, current_sales: 42  },
];

// ─── STOCK PRODUCTS ───────────────────────────────────────────────────────────
export const STOCK_PRODUCTS = [
  { id: 1, name: "Beef (kg)",       uom: "kg", current_stock: 25.5, reorder_level: 10, buying_price: 800 },
  { id: 2, name: "Chicken (kg)",    uom: "kg", current_stock: 18.2, reorder_level: 8,  buying_price: 550 },
  { id: 3, name: "Tomatoes (kg)",   uom: "kg", current_stock: 6.0,  reorder_level: 5,  buying_price: 120 },
  { id: 4, name: "Cooking Oil (L)", uom: "L",  current_stock: 12.0, reorder_level: 5,  buying_price: 220 },
  { id: 5, name: "Flour (kg)",      uom: "kg", current_stock: 30.0, reorder_level: 15, buying_price: 90  },
  { id: 6, name: "Tilapia (kg)",    uom: "kg", current_stock: 4.5,  reorder_level: 6,  buying_price: 600 },
];

// ─── PRODUCTIONS ──────────────────────────────────────────────────────────────
export const PRODUCTIONS = [
  { id: 1, product: "Beef Burger",     stock_product: "Beef (kg)",     conversion_factor: 0.25, used_stock: 22.25, current_stock: 8  },
  { id: 2, product: "Grilled Chicken", stock_product: "Chicken (kg)",  conversion_factor: 0.5,  used_stock: 27.5,  current_stock: 5  },
  { id: 3, product: "Caesar Salad",    stock_product: "Tomatoes (kg)", conversion_factor: 0.1,  used_stock: 4.2,   current_stock: 14 },
  { id: 4, product: "Tilapia Fillet",  stock_product: "Tilapia (kg)",  conversion_factor: 0.4,  used_stock: 12.8,  current_stock: 3  },
];

// ─── PURCHASES ────────────────────────────────────────────────────────────────
export const PURCHASES = [
  { id: 1, invoice: "INV-2024-001", supplier: "Nairobi Meats Ltd",     received_by: "John K.", invoice_total: 24000, vat_type: "Inclusive", total_vat: 3130, grand_total: 24000, created_at: "2024-06-01" },
  { id: 2, invoice: "INV-2024-002", supplier: "Fresh Farms",           received_by: "Mary A.", invoice_total: 8500,  vat_type: "Exclusive", total_vat: 1360, grand_total: 9860,  created_at: "2024-06-03" },
  { id: 3, invoice: "INV-2024-003", supplier: "Beverage Distributors", received_by: "John K.", invoice_total: 45000, vat_type: "Inclusive", total_vat: 5870, grand_total: 45000, created_at: "2024-06-07" },
  { id: 4, invoice: "INV-2024-004", supplier: "Nairobi Meats Ltd",     received_by: "Mary A.", invoice_total: 18000, vat_type: "Exclusive", total_vat: 2880, grand_total: 20880, created_at: "2024-06-12" },
];

// ─── DAILY SALES ──────────────────────────────────────────────────────────────
export const DAILY_SALES = [
  { time: "08:14", product: "Mineral Water 500ml", qty: 4, unit_price: 50,   total: 200,  channel: "Waiter – Jane M.",  payment: "Cash",   stock_after: 116 },
  { time: "08:32", product: "Tusker Lager 500ml",  qty: 2, unit_price: 300,  total: 600,  channel: "Waiter – James K.", payment: "M-Pesa", stock_after: 46  },
  { time: "09:05", product: "Beef Burger",          qty: 1, unit_price: 650,  total: 650,  channel: "Counter – Self",    payment: "Card",   stock_after: 7   },
  { time: "09:47", product: "Grilled Chicken",      qty: 2, unit_price: 850,  total: 1700, channel: "Waiter – Jane M.", payment: "Cash",   stock_after: 3   },
  { time: "10:12", product: "Krest Bitter Lemon",   qty: 6, unit_price: 80,   total: 480,  channel: "Counter – Self",   payment: "M-Pesa", stock_after: 90  },
  { time: "10:55", product: "Caesar Salad",          qty: 1, unit_price: 550,  total: 550,  channel: "Waiter – James K.", payment: "Card",  stock_after: 13  },
  { time: "11:30", product: "Tilapia Fillet",        qty: 1, unit_price: 1200, total: 1200, channel: "Waiter – Jane M.", payment: "Cash",  stock_after: 2   },
  { time: "12:04", product: "Pilsner Urquell",       qty: 3, unit_price: 350,  total: 1050, channel: "Counter – Self",  payment: "M-Pesa", stock_after: 57  },
];

// ─── DERIVED ──────────────────────────────────────────────────────────────────
export const TOP_SELLERS             = [...PRODUCTS].sort((a, b) => b.current_sales - a.current_sales).slice(0, 5);
export const LOW_STOCK               = PRODUCTS.filter(p => p.stock <= p.reorder_level).sort((a, b) => a.stock - b.stock);
export const TOTAL_MONTHLY_SALES     = DAILY_SALES.reduce((s, r) => s + r.total, 0) * 38;
export const TOTAL_MONTHLY_PURCHASES = PURCHASES.reduce((s, p) => s + p.grand_total, 0);
export const SHIFT_SALES             = DAILY_SALES.reduce((s, r) => s + r.total, 0);
