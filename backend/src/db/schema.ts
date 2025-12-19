import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// User Settings table
export const userSettings = sqliteTable("user_settings", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  currency: text("currency").default("USD"),
  darkMode: integer("dark_mode", { mode: "boolean" }).default(false),
  notifications: integer("notifications", { mode: "boolean" }).default(true),
  faceId: integer("face_id", { mode: "boolean" }).default(false),
});

// Categories table
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  type: text("type", { enum: ["expense", "income"] }).notNull(),
});

// Wallets table
export const wallets = sqliteTable("wallets", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", { enum: ["cash", "bank", "credit", "savings"] }).default("cash"),
  currency: text("currency").default("USD"),
  balance: real("balance").default(0),
  icon: text("icon"),
  backgroundImage: text("background_image"),
  excludeFromTotals: integer("exclude_from_totals", {
    mode: "boolean",
  }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Transactions table
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  walletId: text("wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  destinationWalletId: text("destination_wallet_id").references(() => wallets.id, {
    onDelete: "set null",
  }),
  categoryId: text("category_id").references(() => categories.id),
  type: text("type", { enum: ["expense", "income", "transfer"] }).notNull(),
  amount: real("amount").notNull(),
  description: text("description"),
  isRecurring: integer("is_recurring", { mode: "boolean" }).default(false),
  recurrenceInterval: text("recurrence_interval", {
    enum: ["daily", "weekly", "monthly", "yearly"],
  }),
  transactionDate: integer("transaction_date", {
    mode: "timestamp",
  }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Budgets table
export const budgets = sqliteTable("budgets", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categories.id),
  name: text("name").notNull(),
  limitAmount: real("limit_amount").notNull(),
  spentAmount: real("spent_amount").default(0),
  frequency: text("frequency", {
    enum: ["weekly", "monthly", "yearly", "daily", "one-time"],
  }).default("monthly"),
  alertEnabled: integer("alert_enabled", { mode: "boolean" }).default(true),
  startDate: integer("start_date", { mode: "timestamp" }),
  endDate: integer("end_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserSetting = typeof userSettings.$inferSelect;
export type NewUserSetting = typeof userSettings.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
