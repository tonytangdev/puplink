import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.SUPBASE_DB_URL!,
  },
  verbose: true,
  strict: true,
  out: "./drizzle",
});
