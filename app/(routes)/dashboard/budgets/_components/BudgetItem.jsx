/* Card that displays a single budget's summary and spend progress, linking to its expenses page. */
import Link from 'next/link'
import React from 'react'
/*The universal format and layout of the budget card*/
function BudgetItem({ budget }) {
    /* Calculate the percentage of the budget spent. */
    const calculatePercentage = () => {
        const percentage = (budget.totalSpend / budget.amount) * 100;
        /* Make the percentage a fixed decimal(2) */
        return percentage.toFixed(2);
    }
    /*Stops the progress bar from going out of the area when overspent on expenses.*/
    const calculateBarWidth = () => {
        const percentage = Number(calculatePercentage());
        /* If the percentage is not a number or is negative, return 0. */
        if (!percentage || percentage < 0) return 0;
        /* if over 100 use 100 otherwise use the real value. */
        return percentage > 100 ? 100 : percentage;
    }
    /* Determine if the budget is over the allocated amount.
    If totalSpend is greater than amount isOverBudget becomes true*/
    const isOverBudget = budget.totalSpend > budget.amount;

    /* Render the budget card with a link to the budget's expenses page. */
    return (
        <Link href={"/dashboard/expenses/" + budget?.id} >
            <div
                className="flex flex-col justify-between border rounded-lg p-5
                cursor-pointer hover:shadow-md hover:-translate-y-3 duration-300 min-h-36 backdrop-blur-md">
                {/* Main budget summary card content. */}
                <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex min-w-0 flex-1 items-center">
                        <h2 className="shrink-0 text-2xl p-2 px-4
                        bg-slate-100 rounded-full
                        mr-2">
                            {budget?.icon}
                        </h2>
                        <div className="min-w-0">
                            <h2 className="font-bold text-lg break-words">{budget.name}</h2>
                            <h2 className="text-sm text-gray-500">{budget.totalItem} Items</h2>
                        </div>

                    </div>
                    <h2 className="shrink-0 text-primary font-bold text-xl sm:text-2xl">${budget.amount}</h2>
                </div>
                <div className="pt-5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 justify-between mb-1">
                        <h2 className="text-xs text-slate-500"> ${budget.totalSpend ? budget.totalSpend : 0} Spend</h2>
                        {/* If budget is over budget, display over budget message in red otherwise, display remaining amount in gray */}
                        <h2 className={`text-xs ${isOverBudget ? "text-red-600 font-medium" : "text-slate-500"}`}>
                            {isOverBudget
                                ? `$${budget.totalSpend - budget.amount} Over Budget`
                                : `$${budget.amount - budget.totalSpend} Remaining`}
                        </h2>
                    </div>
                    <div className="w-full bg-slate-300 h-2 rounded-full">
                        {/* Progress bar shows red if over budget and if not over budget then primary color */}
                        <div className={`h-2 rounded-full ${isOverBudget ? "bg-red-600" : "bg-primary"}`}
                            style={{ width: `${calculateBarWidth()}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default BudgetItem
