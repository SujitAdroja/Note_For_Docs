import type { Config } from "drizzle-kit";
import config from "./src/config";

export const dsn = config.DATABASE_CONNECTION
	? config.DATABASE_CONNECTION
	: `postgres://${config.DB_USER}:${config.DB_PASSWORD}@${
			config.DB_HOST
		}:${config.DB_PORT}/${config.DB_NAME}${
			config.DB_SSL === "false"
				? ""
				: `?ssl=${config.DB_SSL?.toLowerCase() ?? "true"}`
		}`;

export default {
	schema: "./src/drizzle/schema/*.ts",
	out: "./src/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: dsn,
	},
} satisfies Config;
