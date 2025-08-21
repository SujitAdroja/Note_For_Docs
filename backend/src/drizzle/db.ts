import * as schema from "./schema/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { dsn } from "../../drizzle.config";

export const runMigration = async () => {
	console.info("Running migration");
	const migrationClient = postgres(dsn, { max: 1 });
	const res = await migrate(drizzle(migrationClient), {
		migrationsFolder: "./src/drizzle/migrations",
	});
	migrationClient.end();
	console.info("Migration done");
	return res;
};

export const pgQueryClient = postgres(dsn);
export const db = drizzle(pgQueryClient, { schema });
