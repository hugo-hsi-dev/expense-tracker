import { auth } from "~/features/auth/lib/.server/auth";

export default async function getSession(headers: Headers) {
	return await auth.api.getSession({
		headers,
	});
}
