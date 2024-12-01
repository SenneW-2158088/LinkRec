import { defineConfig } from 'drizzle-kit';;

console.log("DATABASE_URL", process.env.DATABASE_URL!)

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: "localhost",
    url: process.env.DATABASE_URL!,
    user: "admin",
    password: "admin",
    database: "linkrec_database",
    ssl: false,
  },
});
