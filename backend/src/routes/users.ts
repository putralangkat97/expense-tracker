import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
// import { randomUUID } from "crypto";

export const usersRoutes = new Elysia({ prefix: "/api/users" })
  // Get all users
  .get("/", async () => {
    return await db.select().from(users);
  })
  // Get user by ID
  .get("/:id", async ({ params: { id } }) => {
    const result = await db.select().from(users).where(eq(users.id, id));
    if (result.length === 0) {
      return { error: "User not found" };
    }
    return result[0];
  })
  // Update user
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      await db
        .update(users)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));
      return { id, ...body };
    },
    {
      body: t.Object({
        email: t.Optional(t.String()),
        fullName: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        bio: t.Optional(t.String()),
        avatarUrl: t.Optional(t.String()),
      }),
    },
  )
  // Delete user
  .delete("/:id", async ({ params: { id } }) => {
    await db.delete(users).where(eq(users.id, id));
    return { success: true };
  });
