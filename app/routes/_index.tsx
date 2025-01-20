import type { Route } from ".react-router/types/app/routes/+types/_index";
import ErrorMessage from "~/components/error-message";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<div>
			<input type="text" className="input" />
			<ErrorMessage>Some Error Message</ErrorMessage>
		</div>
	);
}
