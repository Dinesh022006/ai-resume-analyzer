import { PrismaClient } from "@prisma/client";

// Since Prisma 7, we can use the neon adapter for serverless edge compatibility or direct connections.
// However, if we just want a standard Prisma client, Prisma 7 uses adapter automatically if configured, or just standard.
// Let's create a standard singleton client for Next.js.
// Since the user might be using local postgres right now and will switch to Neon later,
// we will just use standard PrismaClient. Prisma automatically picks up DATABASE_URL from process.env via prisma.config.ts

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create standard client. Prisma 7 handles the datasource via prisma.config.ts
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;