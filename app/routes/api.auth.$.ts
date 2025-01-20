import type { Route } from ".react-router/types/app/routes/+types/api.auth.$";
import { auth } from "~/features/auth/lib/.server/auth";

export async function loader({ request }: Route.LoaderArgs) {
	return auth.handler(request);
}

export async function action({ request }: Route.ActionArgs) {
	return auth.handler(request);
}
