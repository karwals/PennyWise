"use client"
import { db } from '@/utils/dbConfig';
import { useUser } from '@clerk/nextjs'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo';
import { Budgets, Expenses } from '@/utils/schema';
function Dashboard() {
    const { user } = useUser();

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

    }
    /*Dashboard page that greets the user and shows them their budget information*/
    return (
        <div className="p-5">
            <h1 className="font-bold text-3xl text-primary pb-2 border-b-4 border-primary">Hi, {user?.username}</h1>
            <p className="text-gray-500">Here is what is happening with your money:</p>

            <CardInfo budgetList={budgetList} />
        </div>
    )
}

export default Dashboard