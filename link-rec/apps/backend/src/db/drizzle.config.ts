import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

console.log("DATABASE_URL", process.env.DATABASE_URL!)

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: false,
  },
});