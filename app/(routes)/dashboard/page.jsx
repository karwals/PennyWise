"use client"
import { db } from '@/utils/dbConfig';
import { useUser } from '@clerk/nextjs'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo';
import { Budgets, Expenses } from '@/utils/schema';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ListOfExpenses from './expenses/_components/ListOfExpenses';

function Dashboard() {
    const { user } = useUser();
    /*This is the state that holds the expenses list that is fetched from the database. */
    const [expensesList, setExpensesList] = useState([]);
    /*This is the state that holds the budget list that is fetched from the database. */
    const [budgetList, setBudgetList] = useState([]);
    /*This runs when the user loads*/
    useEffect(() => {
        user && getBudgetList()
    }, [user])
    /*Used to get budget list from database*/
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

    /*Dashboard page that greets the user and shows them their budget information*/
    return (
        <div className="p-5">
            <h1 className="font-bold text-3xl text-primary pb-1 border-b-4 border-primary">Hi, {user?.username}</h1>
            <p className="text-gray-500">Here is what's happening with your money:</p>

            <CardInfo budgetList={budgetList} />
            <div className="grid grid-cols-1 md:grid-cols-3 mt-7 gap-5">
                <div className="md:col-span-2">
                    <BarChartDashboard
                        budgetList={budgetList}
                    />
                    <h2 className="text-2xl text-primary font-bold mt-5">Recent Expenses</h2>
                    <ListOfExpenses
                        expensesList={expensesList}
                        refreshData={getBudgetList}
                    />
                </div>
                <div>
                    <h2 className="text-2xl text-primary font-bold">Budgets</h2>
                    <div className="grid gap-4">
                        {budgetList.map((budget, index) => (
                            <BudgetItem budget={budget} key={index}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
