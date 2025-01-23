import { redirect } from "react-router";
import getSession from "~/features/auth/helpers/get-session";

export default async function validateSession(headers: Headers) {
	const session = await getSession(headers);

	if (!session) {
		throw redirect("/sign-in");
	}
	return session;
}
