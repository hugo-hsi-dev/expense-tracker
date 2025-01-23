import { parseWithZod } from "@conform-to/zod";
import getSession from "~/features/auth/helpers/get-session";
import { createPaymentZod } from "~/features/payments/schemas/create-payment.zod";
import { db } from "~/lib/.server/db";
import { paymentTable } from "~/lib/schemas";

export default async function validateCreatePayment(
	formData: FormData,
	headers: Headers,
) {
	const submission = parseWithZod(formData, { schema: createPaymentZod });

	if (submission.status !== "success") {
		return submission.reply();
	}

	const session = await getSession(headers);

	if (!session) {
		return submission.reply({ formErrors: ["Unauthorized"] });
	}

	try {
		await db
			.insert(paymentTable)
			.values({ ...submission.value, userId: session.user.id });
	} catch (err) {
		if (err instanceof Error) {
			submission.reply({ formErrors: ["Something went wrong"] });
		}
	}

	return submission.reply({ resetForm: true });
}
