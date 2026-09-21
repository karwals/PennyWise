"use client"

import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { getBudgetList } from '../../_components/budgetQueries';
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'
/* Gets the current user's budget details from the database and puts them in a grid using the BudgetItem file. */
function BudgetList() {

  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  
  useEffect(() => {
    loadBudgets()
  }, [user])
  /*where it the skeleton is being shown or not*/
  const [loading, setLoading] = useState(true)
  /*Used to get budget list from database*/
  const loadBudgets = async () => {
    /* gets the budget list from the database. It also gets the total spend and total item count for each budget. */
    setBudgetList(await getBudgetList(user?.primaryEmailAddress?.emailAddress))
    /*stop skeleton loader when the budget list is loaded*/
    setLoading(false)

  }
  /*This is the main return of the budget list, it has a create budget button and then a grid of the budgets that the user has made*/
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1
      md:grid-cols-2 lg:grid-cols-3
      gap-5">
        {/*Makes sure to get the new budget list after a new one is added so the new one is also there*/}
        <CreateBudget
          refreshData={loadBudgets}
        />
        {/*while the budget list is loading it will show the skeleton loader
      and once it is loaded it will show the budget card.
      If there are not budget then it will show the skeleton loader till the website connected with the database and then stop*/}
        {!loading? budgetList.map((budget, index) => (
          <BudgetItem
            key={budget.id}
            budget={budget}
          />
        ))
          : [1, 2, 3, 4, 5].map((item, index) => (
            <div key={index} className="w-full bg-slate-300
      rounded-lg h-36 animate-pulse">
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default BudgetList