import React from 'react'
import BudgetList from './_components/BudgetList'

function Budgets() {
    return (
        <div className="p-5">
            <h2 className="font-bold text-3xl text-primary pb-2 border-b-4 border-primary">My Budgets</h2>
            <BudgetList />
        </div>
    )
}

export default Budgets 