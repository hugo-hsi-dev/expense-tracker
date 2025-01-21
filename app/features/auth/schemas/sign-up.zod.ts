import { z } from "zod";

export const signUpZod = z
	.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(8).max(32),
		confirmPassword: z.string(),
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})
	.transform(({ email, name, password }) => ({ name, email, password }));
