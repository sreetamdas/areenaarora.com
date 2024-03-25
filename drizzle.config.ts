import path from "path";
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/lib/server/schema.ts",
	out: "./drizzle",
	driver: "d1", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
	dbCredentials: {
		wranglerConfigPath: path.resolve(__dirname, "wrangler.toml"),
		dbName: "areenaarora-com",

		// host: process.env.DB_HOST,
		// user: process.env.DB_USER,
		// password: process.env.DB_PASSWORD,
		// database: process.env.DB_NAME,
	},
} satisfies Config;
