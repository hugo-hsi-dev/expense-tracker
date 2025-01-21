import { createSelectSchema } from "drizzle-zod";
import { paymentTable } from "~/lib/schemas";

export const deletePaymentZod = createSelectSchema(paymentTable).pick({
	id: true,
});
