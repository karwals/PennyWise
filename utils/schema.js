import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const Bugets=pgTable("budgets",{
    id:serial("id").primaryKey(),
    name:varchar("name").notNull(),
    amount:varchar("amount").notNull(),
    icon:varchar("icon"),
    createdby:varchar("reatedBy").notNull()
})