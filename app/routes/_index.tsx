import type { Route } from ".react-router/types/app/routes/+types/_index";
import { redirect } from "react-router";
import { auth } from "~/features/auth/lib/.server/auth";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return redirect("/sign-in");
	}
	return redirect("/app");
}

export default function IndexRoute() {
	return <div>hello world</div>;
}
