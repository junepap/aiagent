
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || "postgres://localhost:5432/defaultdb";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: databaseUrl,
  },
});
