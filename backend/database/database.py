from database.connection import get_connection

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    tables = [
        COMPANY_DETAILS,
        SYSTEM_SETTINGS,
        TAX_TYPES,
        USER_ROLES,
        USERS,
        STORE_DEPARTMENTS,
        PRODUCT_DEPARTMENTS,
        USER_PRODUCT_DEPARTMENTS,
        USER_STORE_DEPARTMENTS,
        PRODUCT_CATEGORIES,
        PRODUCTS,
        STOCK_PRODUCTS,
        PRODUCTIONS,
        STOCK_ISSUES,
        STOCK_LEDGER,
        STOCK_TAKE_RECORDS,
        SHIFTS,
        ORDERS,
        ORDER_ITEMS,
        VOIDED_ORDERS,
        SUPPLIERS,
        PURCHASES,
        PURCHASE_ITEMS,
        SHIFT_STOCK_SNAPSHOT,
        SHIFT_PRODUCTS_SNAPSHOT,
        SYNC_QUEUE,
        SYNC_STATE
    ]

    for table in tables:
        cursor.execute(table)

    conn.commit()
    conn.close()

COMPANY_DETAILS = """
CREATE TABLE IF NOT EXISTS company_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    company_name TEXT NOT NULL UNIQUE,
    business_type TEXT,
    pin TEXT,
    phone TEXT,
    physical_address TEXT,
    tax_number TEXT,
    payment_details TEXT,
    receipt_footer TEXT,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
);
"""

SYSTEM_SETTINGS = """
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shift_start_time TEXT,
    shift_end_time TEXT,
    enable_sync INTEGER DEFAULT 1,
    sync_interval INTEGER DEFAULT 60,
    allow_negative_stock INTEGER DEFAULT 0,
    auto_deduct_stock INTEGER DEFAULT 1,
    auto_print_receipt INTEGER DEFAULT 1,
    auto_print_docket INTEGER DEFAULT 1,
    dark_mode INTEGER DEFAULT 0,
    auto_logout_minutes INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

TAX_TYPES = """
CREATE TABLE IF NOT EXISTS tax_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    name TEXT NOT NULL,
    percentage REAL NOT NULL,
    is_active INTEGER DEFAULT 1,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);
"""

USER_ROLES = """
CREATE TABLE IF NOT EXISTS user_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    name TEXT NOT NULL,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);
"""

USERS = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    employee_id TEXT NOT NULL UNIQUE,
    id_number TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL,
    password TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    sales_limit REAL DEFAULT 0,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);
"""

STORE_DEPARTMENTS = """
CREATE TABLE IF NOT EXISTS store_departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    name TEXT NOT NULL UNIQUE,
    use_production_stock INTEGER DEFAULT 1,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);
"""

PRODUCT_DEPARTMENTS = """
CREATE TABLE IF NOT EXISTS product_departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    name TEXT NOT NULL,
    store_dept_id INTEGER,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(store_dept_id)
        REFERENCES store_departments(id)
);
"""

USER_PRODUCT_DEPARTMENTS = """
CREATE TABLE IF NOT EXISTS user_product_departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_department_id INTEGER NOT NULL,
    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY(product_department_id)
        REFERENCES product_departments(id)
        ON DELETE CASCADE
);
"""

USER_STORE_DEPARTMENTS = """
CREATE TABLE IF NOT EXISTS user_store_departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    store_department_id INTEGER NOT NULL,
    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY(store_department_id)
        REFERENCES store_departments(id)
        ON DELETE CASCADE
);
"""

PRODUCT_CATEGORIES = """
CREATE TABLE IF NOT EXISTS product_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    name TEXT NOT NULL,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    deleted INTEGER DEFAULT 0
);
"""

PRODUCTS = """
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    department TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);
"""

STOCK_PRODUCTS = """
CREATE TABLE IF NOT EXISTS stock_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    name TEXT NOT NULL UNIQUE,
    department_id INTEGER,
    uom TEXT,
    current_stock REAL DEFAULT 0,
    reorder_level REAL NOT NULL,
    buying_price REAL DEFAULT 0,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(department_id)
        REFERENCES store_departments(id)
);
"""

PRODUCTIONS = """
CREATE TABLE IF NOT EXISTS productions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    product_id INTEGER NOT NULL,
    stock_product_id INTEGER NOT NULL,
    conversion_factor REAL NOT NULL,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,
    FOREIGN KEY(stock_product_id)
        REFERENCES stock_products(id)
        ON DELETE CASCADE
);
"""

STOCK_ISSUES = """
CREATE TABLE IF NOT EXISTS stock_issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    shift_id INTEGER NOT NULL,
    department TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    stock_product_id INTEGER NOT NULL,
    quantity REAL NOT NULL,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(shift_id)
        REFERENCES shifts(id)
        ON DELETE CASCADE,
    FOREIGN KEY(product_id)
        REFERENCES products(id),
    FOREIGN KEY(stock_product_id)
        REFERENCES stock_products(id)
);
"""

STOCK_LEDGER = """
CREATE TABLE IF NOT EXISTS stock_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    stock_product_id INTEGER NOT NULL,
    shift_id INTEGER NOT NULL,
    movement_type TEXT NOT NULL,
    quantity REAL NOT NULL,
    direction TEXT NOT NULL,
    reference_table TEXT,
    reference_id INTEGER,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(stock_product_id)
        REFERENCES stock_products(id),
    FOREIGN KEY(shift_id)
        REFERENCES shifts(id)
);
"""

STOCK_TAKE_RECORDS = """
CREATE TABLE IF NOT EXISTS stock_take_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    shift_id INTEGER NOT NULL,
    product_id INTEGER,
    current_stock REAL NOT NULL,
    physical_stock REAL NOT NULL,
    variance REAL NOT NULL,
    variance_type TEXT NOT NULL,
    total_amount REAL NOT NULL,
    stock_take_type TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(shift_id)
        REFERENCES shifts(id)
        ON DELETE CASCADE
);
"""

SHIFTS = """
CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    shift_code TEXT NOT NULL UNIQUE,
    start_time TEXT,
    end_time TEXT,
    status TEXT DEFAULT 'OPEN',
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);
"""

ORDERS = """
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    shift_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    customer_name TEXT,
    total_amount REAL DEFAULT 0,
    status TEXT NOT NULL,
    department TEXT,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(shift_id)
        REFERENCES shifts(id)
        ON DELETE CASCADE,
    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
"""

ORDER_ITEMS = """
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER DEFAULT 1,
    subtotal REAL NOT NULL,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,

    FOREIGN KEY(product_id)
        REFERENCES products(id)
);
"""

VOIDED_ORDERS = """
CREATE TABLE IF NOT EXISTS voided_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    original_order_id INTEGER NOT NULL,
    user_id INTEGER,
    customer_name TEXT,
    total_amount REAL,
    void_reason TEXT,
    voided_by INTEGER,
    voided_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(user_id)
        REFERENCES users(id),
    FOREIGN KEY(original_order_id)
        REFERENCES orders(order_id)
);
"""

SUPPLIERS = """
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    supplier_name TEXT NOT NULL,
    phone TEXT,
    pin TEXT,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);
"""

PURCHASES = """
CREATE TABLE IF NOT EXISTS purchases (
    purchase_id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    supplier_id INTEGER NOT NULL,
    received_by TEXT,
    invoice_number TEXT NOT NULL,
    invoice_total REAL NOT NULL,
    vat_type TEXT NOT NULL,
    total_vat REAL DEFAULT 0,
    grand_total REAL DEFAULT 0,
    shift_id INTEGER,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(supplier_id)
        REFERENCES suppliers(id),

    FOREIGN KEY(shift_id)
        REFERENCES shifts(id)
);
"""

PURCHASE_ITEMS = """
CREATE TABLE IF NOT EXISTS purchase_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    purchase_id INTEGER NOT NULL,
    stock_product_id INTEGER NOT NULL,
    quantity REAL NOT NULL,
    supplier_cost REAL NOT NULL,
    vat_amount REAL NOT NULL,
    item_total REAL NOT NULL,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY(purchase_id)
        REFERENCES purchases(purchase_id)
        ON DELETE CASCADE,

    FOREIGN KEY(stock_product_id)
        REFERENCES stock_products(id)
        ON DELETE CASCADE
);
"""

SHIFT_STOCK_SNAPSHOT = """
CREATE TABLE IF NOT EXISTS shift_stock_snapshot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    stock_product_id INTEGER NOT NULL,
    shift_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    opening_stock REAL NOT NULL DEFAULT 0,
    purchased_stock REAL NOT NULL DEFAULT 0,
    used_stock REAL NOT NULL DEFAULT 0,
    closing_stock REAL NOT NULL DEFAULT 0,
    stock_take REAL NOT NULL DEFAULT 0,
    variance REAL NOT NULL DEFAULT 0,
    buying_price REAL NOT NULL DEFAULT 0,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    UNIQUE(stock_product_id, shift_id),
    FOREIGN KEY(stock_product_id)
        REFERENCES stock_products(id)
        ON DELETE CASCADE,

    FOREIGN KEY(shift_id)
        REFERENCES shifts(id)
        ON DELETE CASCADE
);
"""

SHIFT_PRODUCTS_SNAPSHOT = """
CREATE TABLE IF NOT EXISTS shift_products_snapshot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT,
    product_id INTEGER NOT NULL,
    shift_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    opening_stock REAL NOT NULL DEFAULT 0,
    closing_stock REAL NOT NULL DEFAULT 0,
    sales REAL NOT NULL DEFAULT 0,
    added_stock REAL NOT NULL DEFAULT 0,
    selling_price REAL NOT NULL DEFAULT 0,
    sync_status TEXT DEFAULT 'PENDING',
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    UNIQUE(product_id, shift_id),
    FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    FOREIGN KEY(shift_id)
        REFERENCES shifts(id)
        ON DELETE CASCADE
);
"""

SYNC_QUEUE = """
CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    operation TEXT NOT NULL,
    payload TEXT NOT NULL,
    sync_status TEXT DEFAULT 'PENDING',
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP
);
"""

SYNC_STATE = """
CREATE TABLE IF NOT EXISTS sync_state (
    id INTEGER PRIMARY KEY,
    last_queue_id INTEGER DEFAULT 0,
    last_sync TIMESTAMP
);
"""
