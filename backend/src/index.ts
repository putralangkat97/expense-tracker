import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";
import { walletsRoutes } from "./routes/wallets";
import { categoriesRoutes } from "./routes/categories";
import { transactionsRoutes } from "./routes/transactions";
import { budgetsRoutes } from "./routes/budgets";

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "super_secret_key_change_me",
    }),
  )
  .get("/", () => "Expense Tracker API")
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
  }))
  .use(authRoutes)
  .derive(async ({ jwt, headers }) => {
    const auth = headers["authorization"];
    if (!auth?.startsWith("Bearer ")) {
      return { user: null };
    }
    const token = auth.slice(7);
    const payload = await jwt.verify(token);
    if (!payload) {
      return { user: null };
    }
    return { user: payload };
  })
  .onBeforeHandle(({ user, path, set }) => {
    if (path.startsWith("/auth") || path === "/" || path === "/health") return;
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }
  })
  .use(usersRoutes)
  .use(walletsRoutes)
  .use(categoriesRoutes)
  .use(transactionsRoutes)
  .use(budgetsRoutes)
  .listen({
    hostname: "0.0.0.0",
    port: process.env.PORT || 3000,
  });

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
