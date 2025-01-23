import { z } from "zod";

export const monthAndYearZod = z.object({
	month: z.number(),
	year: z.number(),
});
