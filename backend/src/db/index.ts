import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Connection URL from environment or fallback
const databaseUrl =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/expense_tracker";

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create postgres client
const client = postgres(databaseUrl, {
  max: 10, // Max connections
  idle_timeout: 30,
  connect_timeout: 10,
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

console.log("✓ Database connected to expense_tracker");

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔌 Closing database connection...");
  await client.end();
  process.exit(0);
});
