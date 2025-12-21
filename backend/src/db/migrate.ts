import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./index";
import { categories } from "./schema";
import { and, eq } from "drizzle-orm";

console.log("Running migrations...");

// Run migrations from the drizzle folder
// This ensures the database schema matches exactly what Drizzle Kit generated
migrate(db, { migrationsFolder: "./drizzle" });
console.log("✅ Database migrations completed!");

// Seed default categories
const defaultCategories = [
  {
    name: "Food",
    icon: "restaurant",
    color: "#f97316",
    type: "expense",
  },
  {
    name: "Shopping",
    icon: "shopping_bag",
    color: "#8b5cf6",
    type: "expense",
  },
  {
    name: "Transport",
    icon: "directions_car",
    color: "#3b82f6",
    type: "expense",
  },
  {
    name: "Entertainment",
    icon: "movie",
    color: "#ec4899",
    type: "expense",
  },
  {
    name: "Housing",
    icon: "home",
    color: "#10b981",
    type: "expense",
  },
  {
    name: "Groceries",
    icon: "shopping_cart",
    color: "#22c55e",
    type: "expense",
  },
  {
    name: "Salary",
    icon: "payments",
    color: "#22c55e",
    type: "income",
  },
  {
    name: "Freelance",
    icon: "computer",
    color: "#3b82f6",
    type: "income",
  },
  {
    name: "Investment",
    icon: "trending_up",
    color: "#f59e0b",
    type: "income",
  },
] as const;

console.log("Seeding default categories...");

// Use a transaction to ensure integrity
await db.transaction(async (tx) => {
  for (const cat of defaultCategories) {
    // Check if category already exists by name and type to prevent duplicates
    const existing = await tx
      .select()
      .from(categories)
      .where(and(eq(categories.name, cat.name), eq(categories.type, cat.type)))
      .limit(1);

    if (existing.length === 0) {
      await tx.insert(categories).values({
        id: crypto.randomUUID(),
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        type: cat.type,
      });
    }
  }
});

console.log("✅ Default categories seeded!");
