import type { Route } from ".react-router/types/app/routes/+types/_auth.app";
import { parseWithZod } from "@conform-to/zod";
import { eq } from "drizzle-orm";
import { Link, redirect } from "react-router";
import { auth } from "~/features/auth/lib/.server/auth";
import CreatePaymentForm from "~/features/payments/components/create-payment.form";
import PaymentsTable from "~/features/payments/components/payments.table";
import { createPaymentZod } from "~/features/payments/schemas/create-payment.zod";
import { deletePaymentZod } from "~/features/payments/schemas/delete-payment.zod";
import { db } from "~/lib/.server/db";
import { paymentTable } from "~/lib/schemas";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) {
		return redirect("/sign-in");
	}
	const { user } = session;

	const payments = await db.query.paymentTable.findMany({
		where: ({ userId }, { eq }) => eq(userId, user.id),
	});

	const defaultBudgetData = await db.query.budgetTable.findFirst({
		where: ({ userId }, { eq }) => eq(userId, user.id),
	});

	let defaultBudget = 1000;

	if (defaultBudgetData?.budget) {
		defaultBudget = Number.parseFloat(defaultBudgetData.budget);
	}

	const remainingBudget = payments.reduce((prev, { amount: stringAmount }) => {
		const amount = Number.parseFloat(stringAmount);
		return prev - amount;
	}, defaultBudget);

	return { name: user.name, payments, currentBudget: remainingBudget };
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();

	const intent = formData.get("intent");
	console.log(intent);

	// Create new payment
	if (intent === "create") {
		const submission = parseWithZod(formData, { schema: createPaymentZod });

		if (submission.status !== "success") {
			return submission.reply();
		}

		const session = await auth.api.getSession({ headers: request.headers });

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

	// Delete Payment
	if (intent === "delete") {
		const submission = parseWithZod(formData, { schema: deletePaymentZod });

		if (submission.status !== "success") {
			return submission.reply();
		}

		await db
			.delete(paymentTable)
			.where(eq(paymentTable.id, submission.value.id));
	}
}

export default function AppRoute({ loaderData }: Route.ComponentProps) {
	return (
		<main className="w-screen h-screen flex flex-col gap-6 items-center mt-24">
			<h1 className="text-3xl font-bold">{loaderData.name}</h1>
			<div>Budget remaining for this month: ${loaderData.currentBudget}</div>
			<Link className="btn btn-wide" to="/settings">
				Edit Budget
			</Link>
			<section className="w-[500px]">
				<CreatePaymentForm />
			</section>
			<section className="w-[500px]">
				<PaymentsTable payments={loaderData.payments} />
			</section>
		</main>
	);
}
