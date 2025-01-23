import type { Route } from ".react-router/types/app/routes/+types/_auth.get-payments";
import { auth } from "~/features/auth/lib/.server/auth";
import { monthAndYearZod } from "~/features/history/schemas/month-and-year.zod";
import type { SelectPayment } from "~/features/payments/schemas/payment.type";
import { db } from "~/lib/.server/db";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	const { user } = session;

	const url = new URL(request.url);

	const selectedMonthAndYearParams = url.searchParams.get("monthAndYear");

	const selectedMonthAndYear = monthAndYearZod.safeParse(
		JSON.parse(selectedMonthAndYearParams ?? ""),
	);

	if (!selectedMonthAndYear.success) {
		return [];
	}

	const {
		data: { month: selectedMonth, year: selectedYear },
	} = selectedMonthAndYear;

	const payments = await db.query.paymentTable.findMany({
		where: ({ userId }, { eq }) => eq(userId, user.id),
	});

	const paymentsForThisMonth = payments.reduce(
		(prev, { createdAt, ...rest }) => {
			const createdMonth = createdAt.getMonth() + 1;
			const createdYear = createdAt.getFullYear();

			if (selectedMonth === createdMonth && selectedYear === createdYear) {
				prev.push({ createdAt, ...rest });
			}
			return prev;
		},
		[] as SelectPayment[],
	);
	return paymentsForThisMonth;
}
