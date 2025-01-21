import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData } from "react-router";
import ErrorMessage from "~/components/error-message";
import { editBudgetZod } from "~/features/budget/schemas/edit-budget.zod";
import type { action } from "~/routes/_auth.settings";

type EditBudgetFormProps = {
	currentBudget: string;
};

export default function EditBudgetForm({ currentBudget }: EditBudgetFormProps) {
	const lastResult = useActionData<typeof action>();

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: editBudgetZod });
		},
	});

	return (
		<Form method="POST" id={form.id} onSubmit={form.onSubmit} noValidate>
			<fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
				<legend className="fieldset-legend">Edit Budget</legend>
				<label htmlFor={fields.budget.id}>New Budget</label>
				<label className="input w-full">
					$
					<input
						type="number"
						id={fields.budget.id}
						key={fields.budget.key}
						name={fields.budget.name}
						defaultValue={fields.budget.initialValue}
						placeholder={currentBudget}
					/>
				</label>
				<ErrorMessage>{fields.budget.errors ?? form.errors}</ErrorMessage>
				<button type="submit" className="btn btn-neutral">
					Submit
				</button>
			</fieldset>
		</Form>
	);
}
