import { db } from "~/lib/.server/db";

export default async function getBudgetByUserId(userId: string) {
	return await db.query.budgetTable.findFirst({
		where: (table, { eq }) => eq(table.userId, userId),
	});
}
