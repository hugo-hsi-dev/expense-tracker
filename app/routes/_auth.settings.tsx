import type { Route } from ".react-router/types/app/routes/+types/_auth.settings";
import { parseWithZod } from "@conform-to/zod";
import { eq } from "drizzle-orm";
import { redirect } from "react-router";
import { auth } from "~/features/auth/lib/.server/auth";
import EditBudgetForm from "~/features/budget/components/edit-budget.form";
import { editBudgetZod } from "~/features/budget/schemas/edit-budget.zod";
import { db } from "~/lib/.server/db";
import { budgetTable } from "~/lib/schemas";

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();

	const submission = parseWithZod(formData, { schema: editBudgetZod });

	if (submission.status !== "success") {
		return submission.reply();
	}

	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		return submission.reply({ formErrors: ["Unauthorized"] });
	}

	try {
		await db.transaction(async (tx) => {
			await tx
				.delete(budgetTable)
				.where(eq(budgetTable.userId, session.user.id));

			await tx
				.insert(budgetTable)
				.values({ ...submission.value, userId: session.user.id });
		});
	} catch (err) {
		if (err instanceof Error) {
			return submission.reply({ formErrors: [err.message] });
		}
	}
	return redirect("/app");
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await auth.api.getSession({
		headers: request.headers,
	});
	if (!session) {
		return redirect("/sign-in");
	}
	const { user } = session;

	const budgetData = await db.query.budgetTable.findFirst({
		where: ({ userId }, { eq }) => eq(userId, user.id),
	});

	if (!budgetData) {
		return { budget: "1000" };
	}
	return { budget: budgetData.budget };
}

export default function SettingsPage({ loaderData }: Route.ComponentProps) {
	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<EditBudgetForm currentBudget={loaderData.budget} />
		</div>
	);
}
