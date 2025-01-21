import type { paymentTable } from "~/lib/schemas";

export type SelectPayment = typeof paymentTable.$inferSelect;
