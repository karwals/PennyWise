import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./utils/schema.js",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_dfbou3lEJIn7@ep-still-block-a717as7r-pooler.ap-southeast-2.aws.neon.tech/PennyWise?sslmode=require&channel_binding=require',
    },
});