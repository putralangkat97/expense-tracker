import { Elysia, t } from "elysia";
import { db } from "../db";
import { categories } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export const categoriesRoutes = new Elysia({ prefix: "/categories" })
  // Get all categories
  .get("/", async () => {
    return await db.select().from(categories);
  })
  // Get category by ID
  .get("/:id", async ({ params: { id } }) => {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    if (result.length === 0) {
      return { error: "Category not found" };
    }
    return result[0];
  })
  // Create category
  .post(
    "/",
    async ({ body }) => {
      const id = randomUUID();
      await db.insert(categories).values({
        id,
        name: body.name,
        icon: body.icon,
        color: body.color,
        type: body.type as "expense" | "income",
      });
      return { id, ...body };
    },
    {
      body: t.Object({
        name: t.String(),
        icon: t.String(),
        color: t.String(),
        type: t.String(),
      }),
    },
  )
  // Update category
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const updateData: Record<string, unknown> = { ...body };
      if (body.type) {
        updateData.type = body.type as "expense" | "income";
      }
      await db.update(categories).set(updateData).where(eq(categories.id, id));
      return { id, ...body };
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        icon: t.Optional(t.String()),
        color: t.Optional(t.String()),
        type: t.Optional(t.String()),
      }),
    },
  )
  // Delete category
  .delete("/:id", async ({ params: { id } }) => {
    await db.delete(categories).where(eq(categories.id, id));
    return { success: true };
  });
