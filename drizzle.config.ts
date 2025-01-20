import { defineConfig } from "drizzle-kit";
import { env } from "~/lib/.server/env";

export default defineConfig({
	schema: "./app/lib/.server/schemas.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
