import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';

/*Used to get budget list from database*/
export const getBudgetList = async (email) => {
    const result = await db.select({
        ...getTableColumns(Budgets),

        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        /*Make it so that the budget are only for the ones that the current user has made*/
        .where(eq(Budgets.createdBy, email))
        .groupBy(Budgets.id)
        /*I also decided that i wanted to make the newest budget would be at the top*/
        .orderBy(desc(Budgets.id))
    return result
}

/*Used to get all expenses from database that the user had made*/
export const getAllExpenses = async (email) => {
    const result = await db
        .select({
            ...getTableColumns(Expenses),
        })
        .from(Expenses)
        .innerJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
        .where(eq(Budgets.createdBy, email))
        .orderBy(desc(Expenses.id))

    return result
}