import type { Route } from ".react-router/types/app/routes/+types/_auth";
import { Outlet, redirect } from "react-router";
import { auth } from "~/features/auth/lib/.server/auth";

export async function loader({ request }: Route.LoaderArgs) {
	const session = auth.api.getSession({ headers: request.headers });
	if (!session) {
		return redirect("/sign-in");
	}
}

export default function AuthLayout() {
	return <Outlet />;
}
