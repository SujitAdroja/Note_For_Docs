import z from "zod";
import { config } from "dotenv";
config();

const Config = z
	.object({
		FRONTEND_ENDPOINT: z.string(),
		DB_HOST: z.string(),
		DB_NAME: z.string(),
		DB_PASSWORD: z.string(),
		DB_PORT: z.string(),
		DB_SSL: z.string().optional(),
		DB_USER: z.string(),
		DATABASE_CONNECTION: z.string(),
		PORT: z.string(),
		PERPLEXITY_API_KEY: z.string(),
		JWT_SECRET: z.string(),
		NODE_ENV: z.string(),
	})
	.readonly();

function collectEnv() {
	if (process.env.APP_DB_URL_OVERRIDE) {
		console.warn("!!IMPORTANT!!: DB URL OVERRIDE is active");
	}
	return Object.fromEntries(
		Object.entries(process.env)
			.filter(([key, _val]) => key.startsWith("APP"))
			.map(([key, value]) => [key.substring(4), value]),
	);
}

export default Config.parse(collectEnv());
