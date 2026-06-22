"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { db } from '@/utils/dbConfig'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

function BudgetList() {

  const [budgetList,setBudgetList]= useState([]);
  const {user}=useUser();
  /*This runs when the user loads*/
  useEffect(()=>{
    user&&getBudgetList()
  },[user])
  /*Used to get budget list from database*/
  const getBudgetList=async()=>{
    const result=await db.select({
      ...getTableColumns(Budgets),
      totalSpend:sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem:sql`count(${Expenses.id})`.mapWith(Number)
    }).from(Budgets) 
    .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    /*Make it so that the budget are only for the ones that the current user has made*/
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .groupBy(Budgets.id)
    /*I also decided that i wanted to make the newest budget would be at the top*/
    .orderBy(desc(Budgets.id))
    setBudgetList(result)
    
  }

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1
      md:grid-cols-2 lg:grid-cols-3
      gap-5">
      {/*Makes sure to get the new budget list after a new one is added so the new one is also there*/}
      <CreateBudget
      refreshData={getBudgetList}
      />
      {/*while the budget list is loading it will show the skeleton loader
      and once it is loaded it will show the budget card*/}
      {budgetList?.length>0? budgetList.map((budget,index)=>(
        <BudgetItem 
        key={budget.id}
        budget={budget}
        />
      ))
    :[1,2,3,4,5].map((item,index)=>(
      <div key ={index} className="w-full bg-slate-300
      rounded-lg h-36 animate-pulse">
      </div>
    ))
      }
      </div>
    </div>
  )
}

export default BudgetList