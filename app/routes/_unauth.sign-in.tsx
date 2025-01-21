import type { Route } from ".react-router/types/app/routes/+types/_unauth.sign-in";
import { parseWithZod } from "@conform-to/zod";
import SignInForm from "~/features/auth/components/sign-in.form";
import { signIn } from "~/features/auth/lib/.client/auth";
import { signInZod } from "~/features/auth/schemas/sign-in.zod";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const submission = parseWithZod(formData, {
		schema: signInZod,
	});

	if (submission.status !== "success") {
		return submission.reply();
	}

	const { email, password } = submission.value;

	const { error } = await signIn.email({ email, password });

	if (error) {
		return submission.reply({
			formErrors: ["Your email or password is incorrect"],
		});
	}
}

export default function SignInRoute() {
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<SignInForm />
		</div>
	);
}
