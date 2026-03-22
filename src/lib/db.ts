import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Standart yerleşik pg adapter'ını kullanarak karmaşık ortamlarda hatayı en aza indiriyoruz.
// Fallback ile doğrudan Neon linkimizi koyuyoruz.
const connectionString = process.env.DATABASE_URL || process.env.database_url || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || "postgresql://neondb_owner:npg_rpxWMKE3D4RQ@ep-holy-rice-amt8wal9-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

// PG Pool yapılandırmasını güvenli şekilde kuruyoruz
const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool as any);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
