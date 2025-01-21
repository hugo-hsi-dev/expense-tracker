// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "~/lib/.server/env";
import * as schema from "~/lib/schemas";

export const db = drizzle(env.DATABASE_URL, {
	schema,
	casing: "snake_case",
});
