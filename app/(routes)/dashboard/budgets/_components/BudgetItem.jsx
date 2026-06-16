import React from 'react'

function BudgetItem({budget}) {
    return (
        <div className="border p-5 rounded-lg cursor-pointer hover:shadow-md hover:-translate-y-2 duration-300">
            {/* Main budget summary card content. */}
            <div className = "flex gap-2 items-center justify-between">
                <div className = "flex gap-2 items-center">
                    <h2 className ="text-2xl p-2 px-4
                    bg-slate-100 rounded-full">
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
                    <h2 className="text-xs text-slate-500"> ${budget.amount-budget.totalSpend} Remaining</h2>
                </div>
                <div className="w-full bg-slate-300 h-2 rounded-full">
                    <div className="w-[40%] bg-primary h-2 rounded-full">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BudgetItem