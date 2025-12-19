import { Database } from "bun:sqlite";

const sqlite = new Database("expense-tracker.db");

// Create tables
sqlite.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )
`);

sqlite.run(`
  CREATE TABLE IF NOT EXISTS user_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency TEXT DEFAULT 'USD',
    dark_mode INTEGER DEFAULT 0,
    notifications INTEGER DEFAULT 1,
    face_id INTEGER DEFAULT 0
  )
`);

sqlite.run(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('expense', 'income'))
  )
`);

sqlite.run(`
  CREATE TABLE IF NOT EXISTS wallets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'cash' CHECK(type IN ('cash', 'bank', 'credit', 'savings')),
    currency TEXT DEFAULT 'USD',
    balance REAL DEFAULT 0,
    icon TEXT,
    background_image TEXT,
    exclude_from_totals INTEGER DEFAULT 0,
    created_at INTEGER
  )
`);

sqlite.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_id TEXT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES categories(id),
    type TEXT NOT NULL CHECK(type IN ('expense', 'income', 'transfer')),
    amount REAL NOT NULL,
    description TEXT,
    is_recurring INTEGER DEFAULT 0,
    recurrence_interval TEXT CHECK(recurrence_interval IN ('daily', 'weekly', 'monthly', 'yearly')),
    transaction_date INTEGER,
    created_at INTEGER
  )
`);

sqlite.run(`
  CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES categories(id),
    name TEXT NOT NULL,
    limit_amount REAL NOT NULL,
    spent_amount REAL DEFAULT 0,
    frequency TEXT DEFAULT 'monthly' CHECK(frequency IN ('weekly', 'monthly', 'yearly', 'daily')),
    alert_enabled INTEGER DEFAULT 1,
    start_date INTEGER,
    end_date INTEGER,
    created_at INTEGER
  )
`);

// Seed default categories
const defaultCategories = [
  {
    id: crypto.randomUUID(),
    name: "Food",
    icon: "restaurant",
    color: "#f97316",
    type: "expense",
  },
  {
    id: crypto.randomUUID(),
    name: "Shopping",
    icon: "shopping_bag",
    color: "#8b5cf6",
    type: "expense",
  },
  {
    id: crypto.randomUUID(),
    name: "Transport",
    icon: "directions_car",
    color: "#3b82f6",
    type: "expense",
  },
  {
    id: crypto.randomUUID(),
    name: "Entertainment",
    icon: "movie",
    color: "#ec4899",
    type: "expense",
  },
  {
    id: crypto.randomUUID(),
    name: "Housing",
    icon: "home",
    color: "#10b981",
    type: "expense",
  },
  {
    id: crypto.randomUUID(),
    name: "Groceries",
    icon: "shopping_cart",
    color: "#22c55e",
    type: "expense",
  },
  {
    id: crypto.randomUUID(),
    name: "Salary",
    icon: "payments",
    color: "#22c55e",
    type: "income",
  },
  {
    id: crypto.randomUUID(),
    name: "Freelance",
    icon: "computer",
    color: "#3b82f6",
    type: "income",
  },
  {
    id: crypto.randomUUID(),
    name: "Investment",
    icon: "trending_up",
    color: "#f59e0b",
    type: "income",
  },
];

const insertCategory = sqlite.prepare(
  "INSERT OR IGNORE INTO categories (id, name, icon, color, type) VALUES (?, ?, ?, ?, ?)",
);

for (const cat of defaultCategories) {
  insertCategory.run(cat.id, cat.name, cat.icon, cat.color, cat.type);
}

console.log("✅ Database tables created successfully!");
console.log("✅ Default categories seeded!");
