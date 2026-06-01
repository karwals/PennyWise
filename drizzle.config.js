import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
/* Setting up Drizzle Kit for database connections. */
dotenv.config({ path: ".env.local" });

export default defineConfig({
    schema: "./utils/schema.js",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL,
    },
});