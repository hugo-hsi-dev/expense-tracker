import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData } from "react-router";
import ErrorMessage from "~/components/error-message";
import { createPaymentZod } from "~/features/payments/schemas/create-payment.zod";
import type { action } from "~/routes/_auth.app";

export default function CreatePaymentForm() {
	const lastResult = useActionData<typeof action>();

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: createPaymentZod });
		},
		defaultValue: {
			amount: "0",
			name: "",
		},
		onSubmit() {},
	});

	return (
		<Form method="POST" id={form.id} onSubmit={form.onSubmit} noValidate>
			<input
				className="input w-full"
				type="text"
				key={fields.name.key}
				name={fields.name.name}
				defaultValue={fields.name.initialValue}
			/>
			<ErrorMessage>{fields.name.errors}</ErrorMessage>
			<div className="flex gap-4">
				<input
					className="input w-full"
					type="number"
					key={fields.amount.key}
					name={fields.amount.name}
					defaultValue={fields.amount.initialValue}
				/>
				<button type="submit" name="intent" value="create" className="btn">
					Submit
				</button>
			</div>

			<ErrorMessage>{fields.amount.errors ?? form.errors}</ErrorMessage>
		</Form>
	);
}
