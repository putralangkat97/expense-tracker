import { Elysia, t } from "elysia";
import { db } from "../db";
import { transactions, wallets } from "../db/schema";
import { eq, or } from "drizzle-orm";
import { randomUUID } from "crypto";

export const transactionsRoutes = new Elysia({ prefix: "/transactions" })
  // Get all transactions
  .get("/", async () => {
    return await db.select().from(transactions);
  })
  // Get transactions by user ID
  .get("/user/:userId", async ({ params: { userId } }) => {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  })
  // Get transactions by wallet ID
  .get("/wallet/:walletId", async ({ params: { walletId } }) => {
    return await db
      .select()
      .from(transactions)
      .where(
        or(eq(transactions.walletId, walletId), eq(transactions.destinationWalletId, walletId)),
      );
  })
  // Get transaction by ID
  .get("/:id", async ({ params: { id } }) => {
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    if (result.length === 0) {
      return { error: "Transaction not found" };
    }
    return result[0];
  })
  // Create transaction
  .post(
    "/",
    async ({ body }) => {
      const id = randomUUID();
      await db.insert(transactions).values({
        id,
        userId: body.userId,
        walletId: body.walletId,
        destinationWalletId: body.destinationWalletId,
        categoryId: body.categoryId,
        type: body.type as "expense" | "income" | "transfer",
        amount: body.amount,
        description: body.description,
        isRecurring: body.isRecurring,
        recurrenceInterval: body.recurrenceInterval as
          | "daily"
          | "weekly"
          | "monthly"
          | "yearly"
          | undefined,
        transactionDate: body.transactionDate ? new Date(body.transactionDate) : new Date(),
      });

      // Update wallet balance (Source)
      const wallet = await db.select().from(wallets).where(eq(wallets.id, body.walletId));
      if (wallet.length > 0) {
        const currentBalance = wallet[0].balance || 0;
        // For transfer, it behaves like expense for the source wallet (deducts money)
        const newBalance =
          body.type === "income" ? currentBalance + body.amount : currentBalance - body.amount;
        await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.id, body.walletId));
      }

      // Update destination wallet balance (if transfer)
      if (body.type === "transfer" && body.destinationWalletId) {
        const destWallet = await db
          .select()
          .from(wallets)
          .where(eq(wallets.id, body.destinationWalletId));
        if (destWallet.length > 0) {
          const currentDestBalance = destWallet[0].balance || 0;
          await db
            .update(wallets)
            .set({ balance: currentDestBalance + body.amount })
            .where(eq(wallets.id, body.destinationWalletId));
        }
      }

      return { id, ...body };
    },
    {
      body: t.Object({
        userId: t.String(),
        walletId: t.String(),
        destinationWalletId: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
        type: t.String(),
        amount: t.Number(),
        description: t.Optional(t.String()),
        isRecurring: t.Optional(t.Boolean()),
        recurrenceInterval: t.Optional(t.String()),
        transactionDate: t.Optional(t.String()),
      }),
    },
  )
  // Update transaction
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const updateData: Record<string, unknown> = { ...body };
      if (body.type) {
        updateData.type = body.type as "expense" | "income" | "transfer";
      }
      if (body.recurrenceInterval) {
        updateData.recurrenceInterval = body.recurrenceInterval as
          | "daily"
          | "weekly"
          | "monthly"
          | "yearly";
      }
      if (body.destinationWalletId !== undefined) {
        updateData.destinationWalletId = body.destinationWalletId;
      }

      await db.update(transactions).set(updateData).where(eq(transactions.id, id));
      return { id, ...body };
    },
    {
      body: t.Object({
        categoryId: t.Optional(t.String()),
        type: t.Optional(t.String()),
        amount: t.Optional(t.Number()),
        description: t.Optional(t.String()),
        isRecurring: t.Optional(t.Boolean()),
        recurrenceInterval: t.Optional(t.String()),
        walletId: t.Optional(t.String()),
        destinationWalletId: t.Optional(t.String()),
        transactionDate: t.Optional(t.String()),
      }),
    },
  )
  // Delete transaction
  .delete("/:id", async ({ params: { id } }) => {
    await db.delete(transactions).where(eq(transactions.id, id));
    return { success: true };
  });
