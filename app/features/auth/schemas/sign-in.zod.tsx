import { z } from "zod";

export const signInZod = z.object({
	email: z.string().email(),
	password: z.string(),
});
