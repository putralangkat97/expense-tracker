import { Elysia, t } from "elysia";
import { db } from "../db";
import { users, userSettings } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { jwt } from "@elysiajs/jwt";

// Simple password hashing using Bun
const hashPassword = async (password: string): Promise<string> => {
  return await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await Bun.password.verify(password, hash);
};

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "super_secret_key_change_me",
    }),
  )
  .post(
    "/register",
    async ({ body, set, jwt }) => {
      // Check if user already exists
      const existing = await db.select().from(users).where(eq(users.email, body.email));
      if (existing.length > 0) {
        set.status = 400;
        return { error: "Email already registered" };
      }

      // Hash password
      const passwordHash = await hashPassword(body.password);
      const userId = randomUUID();

      // Create user
      await db.insert(users).values({
        id: userId,
        email: body.email,
        password: passwordHash,
        fullName: body.fullName,
      });

      // Create default user settings
      await db.insert(userSettings).values({
        id: randomUUID(),
        userId: userId,
        currency: "USD",
        darkMode: false,
        notifications: true,
        faceId: false,
      });

      const token = await jwt.sign({
        id: userId,
        email: body.email,
      });

      return {
        success: true,
        token,
        user: {
          id: userId,
          email: body.email,
          fullName: body.fullName,
        },
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        fullName: t.String(),
      }),
    },
  )
  // Login
  .post(
    "/login",
    async ({ body, set, jwt }) => {
      // Find user by email
      const userResult = await db.select().from(users).where(eq(users.email, body.email));
      if (userResult.length === 0) {
        set.status = 401;
        return { error: "Invalid email or password" };
      }

      const user = userResult[0];

      // Verify password
      const isValid = await verifyPassword(body.password, user.password);
      if (!isValid) {
        set.status = 401;
        return { error: "Invalid email or password" };
      }

      // Get user settings
      const settings = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));

      const token = await jwt.sign({
        id: user.id,
        email: user.email,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
        settings: settings[0] || null,
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    },
  );
