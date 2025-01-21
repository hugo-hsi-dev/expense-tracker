import { relations } from "drizzle-orm";
import {
	decimal,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "~/lib/schemas";

export const paymentTable = pgTable("payment", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text().references(() => user.id),
	name: text().notNull(),
	amount: decimal().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().defaultNow().notNull(),
});

export const paymentTableRelations = relations(paymentTable, ({ one }) => ({
	user: one(user, { fields: [paymentTable.userId], references: [user.id] }),
}));
