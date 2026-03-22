// Prisma config for Vercel deployment
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["database_url"] || process.env["DATABASE_URL"] || process.env["POSTGRES_URL"] || process.env["Postgres_url_DATABASE_URL_UNPOOLED"] || process.env["POSTGRES_PRISMA_URL"],
  },
});
