import { Elysia, t } from "elysia";
import { db } from "../db";
import { budgets } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const budgetsRoutes = new Elysia({ prefix: "/api/budgets" })
  // Get all budgets
  .get("/", async () => {
    return await db.select().from(budgets);
  })
  // Get budgets by user ID
  .get("/user/:userId", async ({ params: { userId } }) => {
    return await db.select().from(budgets).where(eq(budgets.userId, userId));
  })
  // Get budget by ID
  .get("/:id", async ({ params: { id } }) => {
    const result = await db.select().from(budgets).where(eq(budgets.id, id));
    if (result.length === 0) {
      return { error: "Budget not found" };
    }
    return result[0];
  })
  // Create budget
  .post(
    "/",
    async ({ body }) => {
      const id = randomUUID();
      await db.insert(budgets).values({
        id,
        userId: body.userId,
        categoryId: body.categoryId,
        name: body.name,
        limitAmount: body.limitAmount,
        spentAmount: body.spentAmount || 0,
        frequency: body.frequency as "weekly" | "monthly" | "one-time",
        alertEnabled: body.alertEnabled ?? true,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      });
      return { id, ...body };
    },
    {
      body: t.Object({
        userId: t.String(),
        categoryId: t.Optional(t.String()),
        name: t.String(),
        limitAmount: t.Number(),
        spentAmount: t.Optional(t.Number()),
        frequency: t.Optional(t.String()),
        alertEnabled: t.Optional(t.Boolean()),
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
      }),
    },
  )
  // Update budget
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const updateData: Record<string, unknown> = {};
      if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
      if (body.name !== undefined) updateData.name = body.name;
      if (body.limitAmount !== undefined) updateData.limitAmount = body.limitAmount;
      if (body.spentAmount !== undefined) updateData.spentAmount = body.spentAmount;
      if (body.alertEnabled !== undefined) updateData.alertEnabled = body.alertEnabled;
      if (body.frequency) {
        updateData.frequency = body.frequency as "weekly" | "monthly" | "one-time";
      }
      if (body.startDate) {
        updateData.startDate = new Date(body.startDate);
      }
      if (body.endDate) {
        updateData.endDate = new Date(body.endDate);
      }
      await db.update(budgets).set(updateData).where(eq(budgets.id, id));
      return { id, ...body };
    },
    {
      body: t.Object({
        categoryId: t.Optional(t.String()),
        name: t.Optional(t.String()),
        limitAmount: t.Optional(t.Number()),
        spentAmount: t.Optional(t.Number()),
        frequency: t.Optional(t.String()),
        alertEnabled: t.Optional(t.Boolean()),
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
      }),
    },
  )
  // Delete budget
  .delete("/:id", async ({ params: { id } }) => {
    await db.delete(budgets).where(eq(budgets.id, id));
    return { success: true };
  });
