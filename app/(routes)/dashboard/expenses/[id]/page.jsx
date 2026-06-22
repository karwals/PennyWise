"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import BudgetItem from '../../budgets/_components/BudgetItem'
import CreateExpense from '../_components/CreateExpense'
import ListOfExpenses from '../_components/ListOfExpenses'

function ExpensesScreen() {
    const params = useParams()
    const {user} = useUser()
    const [budgetInfo,setBudgetInfo] = useState();
    const [expensesList,setExpensesList] = useState([]);

    useEffect(() => {
        user&&getBudgetInfo()
        
    }, [user])
    /* Gets the selected budget and its expenses */
    const getBudgetInfo=async()=>{
        const result=await db.select({
            ...getTableColumns(Budgets),
            totalSpend:sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem:sql`count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets) 
        .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
        .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
        .where(eq(Budgets.id,params.id))
        .groupBy(Budgets.id)

        setBudgetInfo(result[0])

        getExpensesList()
    }
    /* Gets the list of expenses for the selected budget */
    const getExpensesList = async ()=>{
        const result = await db.select()
        .from(Expenses)
        .where(eq(Expenses.budgetId,params.id))
        .orderBy(desc(Expenses.id))
        setExpensesList(result)
        console.log(result)
    }
    return (
        <div className="p-5">
            <h2 className="text-2xl text-primary font-bold">My Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
                {/*Make sure there is no budget info error and that while the budget info is loading there is a skeleton loader */}
                {budgetInfo? 
                    <BudgetItem
                    budget={budgetInfo}
                    />:
                    <div>
                        <div className="w-full bg-slate-300 rounded-lg h-36 animate-pulse"></div>
                    </div>}
                    <CreateExpense 
                    budgetId={params.id} 
                    user={user}
                    refreshData={()=>getBudgetInfo()} 
                    />
            </div>
            <div className="mt-6">
                <h2 className = "text-2xl text-primary font-bold">Expenses</h2>
                <ListOfExpenses expensesList = {expensesList}/>
            </div>
        </div>
    )
}

export default ExpensesScreen