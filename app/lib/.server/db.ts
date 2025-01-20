// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "~/lib/.server/env";
import * as schema from "~/lib/.server/schema";

export const db = drizzle(env.DATABASE_URL, {
	schema,
});
