import type { z } from "zod";
import type { monthAndYearZod } from "~/features/history/schemas/month-and-year.zod";

export type MonthAndYear = z.infer<typeof monthAndYearZod>;
