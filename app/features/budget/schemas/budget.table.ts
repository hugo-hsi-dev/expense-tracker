import { relations } from "drizzle-orm";
import { decimal, integer, pgTable, text } from "drizzle-orm/pg-core";
import { user } from "~/lib/schemas";

export const budgetTable = pgTable("budget", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(() => user.id),
	budget: decimal().notNull(),
});

export const budgetTableRelations = relations(budgetTable, ({ one }) => ({
	user: one(user, { fields: [budgetTable.userId], references: [user.id] }),
}));
