import { Elysia, t } from "elysia";
import { db } from "../db";
import { wallets } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const walletsRoutes = new Elysia({ prefix: "/api/wallets" })
  // Get all wallets
  .get("/", async () => {
    return await db.select().from(wallets);
  })
  // Get wallets by user ID
  .get("/user/:userId", async ({ params: { userId } }) => {
    return await db.select().from(wallets).where(eq(wallets.userId, userId));
  })
  // Get wallet by ID
  .get("/:id", async ({ params: { id } }) => {
    const result = await db.select().from(wallets).where(eq(wallets.id, id));
    if (result.length === 0) {
      return { error: "Wallet not found" };
    }
    return result[0];
  })
  // Create wallet
  .post(
    "/",
    async ({ body }) => {
      const id = randomUUID();
      await db.insert(wallets).values({
        id,
        userId: body.userId,
        name: body.name,
        type: body.type as "cash" | "bank" | "credit" | "savings",
        currency: body.currency,
        balance: body.balance,
        icon: body.icon,
        backgroundImage: body.backgroundImage,
        excludeFromTotals: body.excludeFromTotals,
      });
      return { id, ...body };
    },
    {
      body: t.Object({
        userId: t.String(),
        name: t.String(),
        type: t.Optional(t.String()),
        currency: t.Optional(t.String()),
        balance: t.Optional(t.Number()),
        icon: t.Optional(t.String()),
        backgroundImage: t.Optional(t.String()),
        excludeFromTotals: t.Optional(t.Boolean()),
      }),
    },
  )
  // Update wallet
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const updateData: Record<string, unknown> = { ...body };
      if (body.type) {
        updateData.type = body.type as "cash" | "bank" | "credit" | "savings";
      }
      await db.update(wallets).set(updateData).where(eq(wallets.id, id));
      return { id, ...body };
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        type: t.Optional(t.String()),
        currency: t.Optional(t.String()),
        balance: t.Optional(t.Number()),
        icon: t.Optional(t.String()),
        backgroundImage: t.Optional(t.String()),
        excludeFromTotals: t.Optional(t.Boolean()),
      }),
    },
  )
  // Delete wallet
  .delete("/:id", async ({ params: { id } }) => {
    await db.delete(wallets).where(eq(wallets.id, id));
    return { success: true };
  });
