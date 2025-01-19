import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<div>
			<button type="button" className="btn">
				hello world
			</button>
		</div>
	);
}
