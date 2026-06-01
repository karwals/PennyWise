import { integer, numeric, pgTable, serial, varchar } from "drizzle-orm/pg-core";
/*makes the table of information for the budgets*/
export const Budgets=pgTable("budgets",{
    name:varchar("name").notNull(),
    amount:numeric("amount").notNull(),
    icon:varchar("icon"),
    createdBy:varchar("createdBy").notNull(),
    id:serial("id").primaryKey(),
})
export const Expenses=pgTable("expenses",{
    id:serial("id").primaryKey(),
    name:varchar("name").notNull(),
    amount:numeric("amount").notNull().default(0) ,
    budgetId:integer("budgetId").references(()=>Budgets.id),
    createdAt:varchar("createdAt").notNull(),
})