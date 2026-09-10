import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardInfo({ budgetList }) {

    const [totalBudgets, setTotalBudgets] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);


    useEffect(()=>{
        budgetList&&calculateCardInfo();
    },[budgetList])

    const calculateCardInfo = () => {
        console.log(budgetList)
        let totalBudget_=0;
        let totalSpend_=0;
        budgetList.forEach(element=>{
            totalBudget_+=Number(element.amount);
            totalSpend_+=element.totalSpend;
        });
        setTotalBudgets(totalBudget_);
        setTotalSpend(totalSpend_);
    console.log(totalBudget_, totalSpend_)

    }
    return (
        <div>
            {budgetList?.length > 0 ?
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-7 border rounded-lg flex items-center justify-between">
                    <div>
                        <h2 className="text-sm ">Total Budgets</h2>
                        <h2 className="text-2xl font-bold">${totalBudgets}</h2>
                    </div>
                    <PiggyBank 
                    className="bg-primary p-3 h-12 w-12 rounded-full text-white"/>
                </div>
                <div className="p-7 border rounded-lg flex items-center justify-between">
                    <div>
                        <h2 className="text-sm ">Total Spent</h2>
                        <h2 className="text-2xl font-bold">${totalSpend}</h2>
                    </div>
                    <ReceiptText 
                    className="bg-primary p-3 h-12 w-12 rounded-full text-white"/>
                </div>
                <div className="p-7 border rounded-lg flex items-center justify-between">
                    <div>
                        <h2 className="text-sm ">No. of Budgets</h2>
                        <h2 className="text-2xl font-bold">{budgetList?.length || 0}</h2>
                    </div>
                    <Wallet
                    className="bg-primary p-3 h-12 w-12 rounded-full text-white"/>
                </div>
                </div>
            :
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1,2,3].map((item, index) => (
                    <div key={index} className="h-40 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                ))}
            </div>
            }
        </div>
    )
}

export default CardInfo