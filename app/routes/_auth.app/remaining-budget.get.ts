import type { SelectPayment } from "~/features/payments/schemas/payment.type";

export default function getRemainingBudget(
	currentPayments: SelectPayment[],
	defaultBudget: number,
) {
	return currentPayments.reduce((prev, { amount: stringAmount }) => {
		const amount = Number.parseFloat(stringAmount);
		return prev - amount;
	}, defaultBudget);
}
