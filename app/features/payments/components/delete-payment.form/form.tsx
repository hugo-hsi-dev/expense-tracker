import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { type FetcherWithComponents, useActionData } from "react-router";
import { deletePaymentZod } from "~/features/payments/schemas/delete-payment.zod";
import type { action } from "~/routes/_auth.app/route";

type DeletePaymentFormProps = {
	paymentId: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	fetcher: FetcherWithComponents<any>;
};

export default function DeletePaymentForm({
	paymentId,
	fetcher,
}: DeletePaymentFormProps) {
	const lastResult = useActionData<typeof action>();

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: deletePaymentZod });
		},
		defaultValue: {
			id: paymentId,
		},
	});

	return (
		<fetcher.Form
			method="DELETE"
			id={form.id}
			onSubmit={form.onSubmit}
			noValidate
		>
			<input
				className="input"
				type="hidden"
				key={fields.id.key}
				name={fields.id.name}
				defaultValue={fields.id.initialValue}
			/>
			<button
				type="submit"
				className="btn btn-xs"
				name="intent"
				value={DeletePaymentForm.intent}
			>
				Delete
			</button>
		</fetcher.Form>
	);
}

DeletePaymentForm.intent = "delete-payment";
