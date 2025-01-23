import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useEffect } from "react";
import { useActionData, useFetcher } from "react-router";
import ErrorMessage from "~/components/error-message";
import { createPaymentZod } from "~/features/payments/schemas/create-payment.zod";
import type { action } from "~/routes/_auth.app/route";

export default function CreatePaymentForm() {
	const fetcher = useFetcher<typeof action>({
		key: CreatePaymentForm.fetcherKey,
	});

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
	});

	useEffect(() => {
		if (fetcher.state === "submitting") {
			form.reset();
		}
	}, [fetcher.state, form.reset]);

	return (
		<fetcher.Form
			method="POST"
			id={form.id}
			onSubmit={(e) => {
				form.onSubmit(e);
			}}
			noValidate
		>
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
				<button type="button" onClick={() => form.reset()}>
					reset
				</button>
				<button
					type="submit"
					name="intent"
					value={CreatePaymentForm.intent}
					className="btn"
				>
					Submit
				</button>
			</div>

			<ErrorMessage>{fields.amount.errors ?? form.errors}</ErrorMessage>
		</fetcher.Form>
	);
}

CreatePaymentForm.intent = "create-payment";
CreatePaymentForm.fetcherKey = "create-payment";
