import { parseWithZod } from "@conform-to/zod";
import { and, eq } from "drizzle-orm";
import validateSession from "~/features/auth/helpers/validate-session";
import { deletePaymentZod } from "~/features/payments/schemas/delete-payment.zod";
import { db } from "~/lib/.server/db";
import { paymentTable } from "~/lib/schemas";

export default async function validateDeletePayment(
	formData: FormData,
	headers: Headers,
) {
	const submission = parseWithZod(formData, { schema: deletePaymentZod });

	const session = await validateSession(headers);

	if (!session) {
		return submission.reply({ formErrors: ["Unauthorized"] });
	}

	const { user } = session;

	if (submission.status !== "success") {
		return submission.reply();
	}
	try {
		const deletedRow = await db
			.delete(paymentTable)
			.where(
				and(
					eq(paymentTable.id, submission.value.id),
					eq(paymentTable.userId, user.id),
				),
			)
			.returning();

		if (!deletedRow) {
			throw new Error("No entry found");
		}
	} catch (err) {
		if (err instanceof Error) {
			return submission.reply({ formErrors: ["Something Went Wrong"] });
		}
	}
}
