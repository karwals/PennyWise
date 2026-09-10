/* Card that displays a single budget's summary and spend progress, linking to its expenses page. */
import Link from 'next/link'
import React from 'react'
/*The universal format and layout of the budget card*/
function BudgetItem({budget}) {

    const calculatePercentage=()=>{
        const percentage = (budget.totalSpend / budget.amount) * 100;
        /* Make the percentage a fixed decimal(2) */
        return percentage.toFixed(2);
    }
    /*Stops the progress bar from going out of the area when overspent on expenses.*/
    const calculateBarWidth=()=>{
        const percentage = Number(calculatePercentage());
        /* if the percentage is 0 it does 0 ans the with and not na*/
        if(!percentage || percentage < 0) return 0;
        /* if over 100, use 100, otherwise use the real value. */
        return percentage > 100 ? 100 : percentage;
    }
    /*See if budget is over or not it is a boolean(true or false)*/
    const isOverBudget = budget.totalSpend > budget.amount;
    return (
        <Link href={'/dashboard/expenses/'+budget?.id} className="flex flex-col justify-between border p-5 rounded-lg cursor-pointer hover:shadow-md hover:-translate-y-2 duration-300 h-36">
            {/* Main budget summary card content. */}
            <div className = "flex gap-2 items-center justify-between">
                <div className = "flex items-center">
                    <h2 className ="text-2xl p-2 px-4
                    bg-slate-100 rounded-full
                    mr-2">
                        {budget?.icon}
                    </h2>
                    <div>
                        <h2 className="font-bold text-lg">{budget.name}</h2>
                        <h2 className="text-sm text-gray-500">{budget.totalItem} Items</h2>
                    </div>
                    
                </div>
                <h2 className="text-primary font-bold text-2xl">${budget.amount}</h2>
            </div>
            <div className="pt-5">
                <div className="flex items-center gap-2 justify-between mb-1">
                    <h2 className="text-xs text-slate-500"> ${budget.totalSpend?budget.totalSpend:0} Spend</h2>
                    {/* If budget is over budget, display over budget message in red; otherwise, display remaining amount in gray */}
                    <h2 className={`text-xs ${isOverBudget?'text-red-600 font-medium':'text-slate-500'}`}>
                        {isOverBudget
                            ? `$${budget.totalSpend-budget.amount} Over Budget`
                            : `$${budget.amount-budget.totalSpend} Remaining`}
                    </h2>
                </div>
                <div className="w-full bg-slate-300 h-2 rounded-full">
                    {/* Progress bar shows red if over budget and if fin then primary color */}
                    <div className={`h-2 rounded-full ${isOverBudget?'bg-red-600':'bg-primary'}`}
                    style={{width:`${calculateBarWidth()}%`}}
                    ></div>
                </div>
            </div>
        </Link>
    )
}

export default BudgetItem
