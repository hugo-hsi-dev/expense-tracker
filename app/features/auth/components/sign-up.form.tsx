import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData } from "react-router";
import ErrorMessage from "~/components/error-message";
import { signUpZod } from "~/features/auth/schemas/sign-up.zod";
import type { clientAction } from "~/routes/_unauth.sign-up";

export default function SignUpForm() {
	const lastResult = useActionData<typeof clientAction>();

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: signUpZod });
		},
	});
	return (
		<Form method="POST" id={form.id} onSubmit={form.onSubmit} noValidate>
			<fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
				<legend className="fieldset-legend">Sign Up</legend>
				<label htmlFor={fields.name.id}>Name</label>
				<input
					className="input"
					id={fields.name.id}
					key={fields.name.key}
					type="text"
					name={fields.name.name}
					defaultValue={fields.name.initialValue}
				/>
				<ErrorMessage>{fields.name.errors}</ErrorMessage>
				<label htmlFor={fields.email.id}>Email</label>
				<input
					className="input"
					id={fields.email.id}
					key={fields.email.key}
					type="email"
					name={fields.email.name}
					defaultValue={fields.email.initialValue}
				/>
				<ErrorMessage>{fields.email.errors}</ErrorMessage>
				<label htmlFor={fields.password.id}>Password</label>
				<input
					className="input"
					key={fields.password.key}
					id={fields.password.id}
					type="password"
					name={fields.password.name}
					defaultValue={fields.password.initialValue}
				/>
				<ErrorMessage>{fields.password.errors}</ErrorMessage>
				<label htmlFor={fields.confirmPassword.id}>Confirm Password</label>
				<input
					className="input"
					id={fields.confirmPassword.id}
					key={fields.confirmPassword.key}
					type="password"
					name={fields.confirmPassword.name}
					defaultValue={fields.confirmPassword.initialValue}
				/>
				<ErrorMessage>{fields.confirmPassword.errors}</ErrorMessage>
				<button type="submit" className="btn btn-neutral">
					Submit
				</button>
			</fieldset>
		</Form>
	);
}
