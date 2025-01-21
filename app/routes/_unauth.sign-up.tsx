import type { Route } from ".react-router/types/app/routes/+types/_unauth.sign-up";
import { parseWithZod } from "@conform-to/zod";
import SignUpForm from "~/features/auth/components/sign-up.form";
import { signUp } from "~/features/auth/lib/.client/auth";
import { auth } from "~/features/auth/lib/.server/auth";
import { signUpZod } from "~/features/auth/schemas/sign-up.zod";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema: signUpZod });
	if (submission.status !== "success") {
		return submission.reply();
	}

	const { name, email, password } = submission.value;
	const result = await signUp.email({ name, email, password }, {});
	console.log(result);
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return null;
	}
	const { user } = session;
	return user.name;
}

export default function LoginRoute() {
	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<SignUpForm />
		</div>
	);
}
