import { monthAndYearZod } from "~/features/history/schemas/month-and-year.zod";
import type { SelectPayment } from "~/features/payments/schemas/payment.type";

export default function getMonthsWithData(payments: SelectPayment[]) {
	const monthsSet = payments.reduce((prev, { createdAt }) => {
		const month = createdAt.getMonth() + 1;
		const year = createdAt.getFullYear();
		const setData = { month, year };
		prev.add(JSON.stringify(setData));
		return prev;
	}, new Set<string>());

	return Array.from(monthsSet).map((jsonString) => {
		const data = JSON.parse(jsonString);

		return monthAndYearZod.parse(data);
	});
}
