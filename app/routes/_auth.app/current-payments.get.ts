import type { SelectPayment } from "~/features/payments/schemas/payment.type";

export default function getCurrentPayments(payments: SelectPayment[]) {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	const filteredPayments = payments.reduce((prev, { createdAt, ...rest }) => {
		const createdMonth = createdAt.getMonth();
		const createdYear = createdAt.getFullYear();

		if (currentMonth === createdMonth && currentYear === createdYear) {
			prev.push({ createdAt, ...rest });
		}
		return prev;
	}, [] as SelectPayment[]);

	const sortedPayments = filteredPayments.sort((a, b) => {
		return b.createdAt.getTime() - a.createdAt.getTime();
	});
	return sortedPayments;
}
