"use client"
import React, { useEffect, useState } from 'react'
import ListOfExpenses from './_components/ListOfExpenses'
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';

function page() {
    const { user } = useUser();
    /*This is the state that holds the expenses list that is fetched from the database. */
    const [expensesList, setExpensesList] = useState([]);
    /*This is the state that holds the budget list that is fetched from the database. */
    const [budgetList, setBudgetList] = useState([]);
    /*Used to get budget list from database*/
    /*This runs when the user loads*/
    useEffect(() => {
        user && getBudgetList()
    }, [user])
    const getBudgetList = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),

            totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            /*Make it so that the budget are only for the ones that the current user has made*/
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .groupBy(Budgets.id)
            /*I also decided that i wanted to make the newest budget would be at the top*/
            .orderBy(desc(Budgets.id))
        setBudgetList(result)
        getAllExpenses()

    }
    /*Used to get all expenses from database that the user had made*/
    const getAllExpenses = async () => {
        const result = await db
            .select({
                ...getTableColumns(Expenses),
            })
            .from(Expenses)
            .innerJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(Expenses.id))

        setExpensesList(result)
    }

    return (
        <div className="p-5">
            <h1 className="font-bold text-3xl text-primary pb-1 border-b-4 border-primary mb-5">Recent Expenses</h1>
            <ListOfExpenses
                expensesList={expensesList}
                refreshData={getBudgetList}
            />
        </div>
    )
}

export default page