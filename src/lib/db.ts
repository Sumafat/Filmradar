import { PrismaClient } from "@prisma/client";

const DATABASE_URL = "postgresql://neondb_owner:npg_rpxWMKE3D4RQ@ep-holy-rice-amt8wal9-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

const connectionString = process.env.DATABASE_URL || 
  process.env.database_url || 
  process.env.POSTGRES_URL || 
  process.env.Postgres_url_DATABASE_URL_UNPOOLED || 
  process.env.POSTGRES_PRISMA_URL || 
  DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: connectionString,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
