import type { Route } from ".react-router/types/app/routes/+types/_auth.app";
import { parseWithZod } from "@conform-to/zod";
import { eq } from "drizzle-orm";
import { Link, redirect, useFetcher } from "react-router";
import { auth } from "~/features/auth/lib/.server/auth";
import CreatePaymentForm from "~/features/payments/components/create-payment.form";
import PaymentsTable from "~/features/payments/components/payments.table";
import { createPaymentZod } from "~/features/payments/schemas/create-payment.zod";
import { deletePaymentZod } from "~/features/payments/schemas/delete-payment.zod";
import { monthAndYearZod } from "~/features/payments/schemas/month-and-year.zod";
import type { SelectPayment } from "~/features/payments/schemas/payment.type";
import { db } from "~/lib/.server/db";
import { paymentTable } from "~/lib/schemas";
import type { loader as selectMonthLoader } from "~/routes/_auth.get-payments";

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

	const monthsSet = payments.reduce((prev, { createdAt }) => {
		const month = createdAt.getMonth() + 1;
		const year = createdAt.getFullYear();
		const setData = { month, year };
		prev.add(JSON.stringify(setData));
		return prev;
	}, new Set<string>());

	const monthsArray = Array.from(monthsSet).map((jsonString) => {
		const data = JSON.parse(jsonString);

		return monthAndYearZod.parse(data);
	});

	const paymentsForThisMonth = payments.reduce(
		(prev, { createdAt, ...rest }) => {
			const currentDate = new Date();
			const currentMonth = currentDate.getMonth();
			const currentYear = currentDate.getFullYear();

			const createdMonth = createdAt.getMonth();
			const createdYear = createdAt.getFullYear();

			if (currentMonth === createdMonth && currentYear === createdYear) {
				prev.push({ createdAt, ...rest });
			}
			return prev;
		},
		[] as SelectPayment[],
	);

	const remainingBudget = paymentsForThisMonth.reduce(
		(prev, { amount: stringAmount }) => {
			const amount = Number.parseFloat(stringAmount);
			return prev - amount;
		},
		defaultBudget,
	);

	return {
		name: user.name,
		payments: paymentsForThisMonth,
		currentBudget: remainingBudget,
		monthsArray,
	};
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
	const fetcher = useFetcher<typeof selectMonthLoader>();
	const currentDate = new Date();
	const defaultValue = JSON.stringify({
		month: currentDate.getMonth(),
		year: currentDate.getFullYear(),
	});

	return (
		<>
			<div className="navbar bg-base-100 shadow-sm">
				<div className="flex-1">
					<span className="text-xl btn btn-ghost">Expense Tracker</span>
				</div>
				<div className="flex-none">
					<fetcher.Form method="GET" action="/get-payments">
						<select
							defaultValue={defaultValue}
							className="select"
							name="monthAndYear"
							onChange={(event) => {
								fetcher.submit(event.currentTarget.form);
							}}
						>
							<option disabled={true}>Pick a month</option>
							{loaderData.monthsArray[0].month !== currentDate.getMonth() + 1 &&
								loaderData.monthsArray[0].year !==
									currentDate.getFullYear() && (
									<option
										value={JSON.stringify({
											month: currentDate.getMonth(),
											year: currentDate.getFullYear(),
										})}
									>
										Current
									</option>
								)}
							{loaderData.monthsArray.map(({ month, year }) => {
								let display: string;

								if (
									month === currentDate.getMonth() + 1 &&
									year === currentDate.getFullYear()
								) {
									display = "Current";
								} else {
									display = `${month}/${year}`;
								}

								return (
									<option
										value={JSON.stringify({ month, year })}
										key={month + year}
									>
										{display}
									</option>
								);
							})}
						</select>
					</fetcher.Form>
				</div>
			</div>
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
					{/* <PaymentsTable payments={loaderData.payments} /> */}
					<PaymentsTable payments={fetcher.data ?? loaderData.payments} />
				</section>
			</main>
		</>
	);
}
