import { db } from "~/lib/.server/db";

export default async function getPaymentsByUserId(userId: string) {
	return await db.query.paymentTable.findMany({
		where: (table, { eq }) => eq(table.userId, userId),
	});
}
