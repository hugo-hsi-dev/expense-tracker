import type { Route } from ".react-router/types/app/routes/_auth.app/+types/route";
import { Link, useFetcher } from "react-router";
import validateSession from "~/features/auth/helpers/validate-session";
import getBudgetByUserId from "~/features/budget/queries/budget.user-id";
import SelectMonthForm from "~/features/history/components/select-month.form";
import getMonthsWithData from "~/features/history/lib/monthsWithData.get";
import CreatePaymentForm from "~/features/payments/components/create-payment.form/form";
import validateCreatePayment from "~/features/payments/components/create-payment.form/validate";
import DeletePaymentForm from "~/features/payments/components/delete-payment.form/form";
import validateDeletePayment from "~/features/payments/components/delete-payment.form/validate";
import PaymentsTable from "~/features/payments/components/payments.table";
import getPaymentsByUserId from "~/features/payments/queries/payments.user-id";
import { createPaymentZod } from "~/features/payments/schemas/create-payment.zod";
import getCurrentPayments from "~/routes/_auth.app/current-payments.get";
import getRemainingBudget from "~/routes/_auth.app/remaining-budget.get";
import type { loader as getPaymentLoader } from "~/routes/_auth.get-payments";

export async function loader({ request }: Route.LoaderArgs) {
	const { user } = await validateSession(request.headers);

	const payments = await getPaymentsByUserId(user.id);

	const budgetData = await getBudgetByUserId(user.id);

	let defaultBudget = 1000;

	if (budgetData?.budget) {
		defaultBudget = Number.parseFloat(budgetData.budget);
	}

	const monthsWithData = getMonthsWithData(payments);
	const currentPayments = getCurrentPayments(payments);

	const remainingBudget = getRemainingBudget(currentPayments, defaultBudget);

	return {
		name: user.name,
		currentPayments,
		remainingBudget,
		monthsWithData,
	};
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();

	const intent = formData.get("intent");

	// Create new payment
	if (intent === CreatePaymentForm.intent) {
		return validateCreatePayment(formData, request.headers);
	}

	// Delete Payment
	if (intent === DeletePaymentForm.intent) {
		return validateDeletePayment(formData, request.headers);
	}

	throw new Error(`unknown intent: ${intent}`);
}

export default function AppRoute({ loaderData }: Route.ComponentProps) {
	let { currentPayments, monthsWithData, name, remainingBudget } = loaderData;

	const selectMonthFetcher = useFetcher<typeof getPaymentLoader>({
		key: SelectMonthForm.fetcherKey,
	});

	const createPaymentFetcher = useFetcher({
		key: CreatePaymentForm.fetcherKey,
	});

	if (createPaymentFetcher.formData) {
		const formData = createPaymentFetcher.formData;
		const data = Object.fromEntries(formData.entries());
		const result = createPaymentZod.safeParse(data);
		if (result.success) {
			const currentDate = new Date();
			currentPayments = [
				{
					id: 0,
					createdAt: currentDate,
					updatedAt: currentDate,
					userId: "",
					...result.data,
				},
				...currentPayments,
			];
		}
	}

	return (
		<div className="w-screen h-screen">
			<div className="navbar bg-base-100 shadow-sm">
				<div className="flex-1">
					<span className="text-xl btn btn-ghost">Expense Tracker</span>
				</div>
				<div className="flex-none">
					<SelectMonthForm monthsWithData={monthsWithData} />
				</div>
			</div>
			<main className="flex flex-col gap-6 items-center pt-24">
				<h1 className="text-3xl font-bold">{name}</h1>
				<div>Budget remaining for this month: ${remainingBudget}</div>
				<Link className="btn btn-wide" to="/settings">
					Edit Budget
				</Link>
				<section className="w-[500px]">
					<CreatePaymentForm />
				</section>
				<section className="w-[500px]">
					<PaymentsTable
						payments={selectMonthFetcher.data ?? currentPayments}
					/>
				</section>
			</main>
		</div>
	);
}
