"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq, getTableColumns, sql } from 'drizzle-orm'

function Expensesscreen() {
    const params = useParams()
    const {user} = useUser()

    useEffect(() => {
        user&&getBudgetInfo()
    }, [user])
    
    const getBudgetInfo=async()=>{
        const result=await db.select({
            ...getTableColumns(Budgets),
            totalSpend:sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem:sql`count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets) 
        .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
        /*Make it so that the budget are only for the ones that the current user has made*/
        .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
        /*Also make it so that the budget is the one that the current user is on*/
        .where(eq(Budgets.id,params.id))
        .groupBy(Budgets.id)
        
        console.log(result);
    }
    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold">My Expenses</h2>
        </div>
    )
}

export default Expensesscreen