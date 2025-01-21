import { createInsertSchema } from "drizzle-zod";
import { budgetTable } from "~/lib/schemas";

export const editBudgetZod = createInsertSchema(budgetTable, {
	budget: (schema) =>
		schema.transform((val, { addIssue }) => {
			const parsedVal = Number.parseFloat(val);

			if (Number.isNaN(parsedVal)) {
				addIssue({ code: "custom", message: "Value is not a valid number" });
			}

			return parsedVal.toFixed(2);
		}),
}).omit({
	userId: true,
});
