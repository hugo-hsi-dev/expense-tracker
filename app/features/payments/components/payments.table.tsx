import PaymentTr from "~/features/payments/components/payment.tr";
import type { SelectPayment } from "~/features/payments/schemas/payment.type";

type PaymentTableProps = {
	payments: SelectPayment[];
};

export default function PaymentsTable({ payments }: PaymentTableProps) {
	console.log(payments);
	return (
		<div className="overflow-x-auto">
			<table className="table">
				<thead>
					<tr>
						<th>{}</th>
						<th>Name</th>
						<th>Amount</th>
						<th>Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{payments.map(({ amount, id, name, createdAt }, index) => (
						<PaymentTr
							amount={amount}
							id={id}
							name={name}
							index={index}
							createdAt={createdAt}
							key={id}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
