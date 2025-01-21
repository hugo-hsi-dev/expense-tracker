import type { Route } from ".react-router/types/app/routes/+types/_unauth";
import { Outlet, redirect } from "react-router";
import { auth } from "~/features/auth/lib/.server/auth";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (session) {
		return redirect("/");
	}
}

export default function UnauthLayout() {
	return <Outlet />;
}
