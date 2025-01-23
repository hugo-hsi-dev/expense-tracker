import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Form, Link, useActionData } from "react-router";
import ErrorMessage from "~/components/error-message";
import { signInZod } from "~/features/auth/schemas/sign-in.zod";
import type { clientAction } from "~/routes/_unauth.sign-in";

export default function SignInForm() {
	const lastResult = useActionData<typeof clientAction>();

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: signInZod });
		},
	});

	return (
		<Form method="POST" id={form.id} onSubmit={form.onSubmit} noValidate>
			<fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
				<legend className="fieldset-legend">Sign In</legend>
				<label htmlFor={fields.email.id}>Email</label>
				<input
					className="input w-full"
					id={fields.email.id}
					key={fields.email.key}
					type="email"
					name={fields.email.name}
					defaultValue={fields.email.initialValue}
				/>
				<ErrorMessage>{fields.email.errors}</ErrorMessage>
				<label htmlFor={fields.password.id}>Password</label>
				<input
					className="input w-full"
					key={fields.password.key}
					type="password"
					name={fields.password.name}
					defaultValue={fields.password.initialValue}
				/>
				<ErrorMessage>{fields.password.errors ?? form.errors}</ErrorMessage>
				<p className="mb-2">
					Don't have an account?{" "}
					<Link to="/sign-up" className="link">
						Create an account
					</Link>
				</p>
				<button type="submit" className="btn btn-neutral">
					Submit
				</button>
			</fieldset>
		</Form>
	);
}
