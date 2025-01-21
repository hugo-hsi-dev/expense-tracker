import { createInsertSchema } from "drizzle-zod";
import { paymentTable } from "~/lib/schemas";

export const createPaymentZod = createInsertSchema(paymentTable, {
	amount: (schema) =>
		schema.transform((val, { addIssue }) => {
			const parsedVal = Number.parseFloat(val);

			if (Number.isNaN(parsedVal)) {
				addIssue({ code: "custom", message: "Value is not a valid number" });
			}

			return parsedVal.toFixed(2);
		}),
}).omit({
	createdAt: true,
	updatedAt: true,
	userId: true,
});
