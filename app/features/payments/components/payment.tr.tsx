import { useFetcher } from "react-router";
import DeletePaymentForm from "~/features/payments/components/delete-payment.form/form";

type PaymentTrProps = {
	id: number;
	amount: string;
	name: string;
	index: number;
	createdAt: Date;
};

export default function PaymentTr({
	amount,
	id,
	index,
	name,
	createdAt,
}: PaymentTrProps) {
	const deleteFetcher = useFetcher();

	if (deleteFetcher.formData) {
		return;
	}

	return (
		<tr className="list-row">
			<th>{index}</th>
			<th>{name}</th>
			<th>{amount}</th>
			<th>{createdAt.toLocaleDateString("en-US")}</th>
			<th>
				<DeletePaymentForm fetcher={deleteFetcher} paymentId={id} />
			</th>
		</tr>
	);
}
