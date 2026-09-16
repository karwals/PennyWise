import { PiggyBank, ReceiptText, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'
/*Component that shows the total budgets, total spent and number of budgets the user has made*/
function CardInfo({ budgetList }) {

    const [totalBudgets, setTotalBudgets] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);


    useEffect(() => {
        budgetList && calculateCardInfo();
    }, [budgetList])
    /*Calculates the total budgets and total spent from the budget list and sets the state accordingly*/
    const calculateCardInfo = () => {
        console.log(budgetList)
        let totalBudget_ = 0;
        let totalSpend_ = 0;
        budgetList.forEach(element => {
            totalBudget_ += Number(element.amount);
            totalSpend_ += element.totalSpend;
        });
        setTotalBudgets(totalBudget_);
        setTotalSpend(totalSpend_);
        console.log(totalBudget_, totalSpend_)

    }
    /*Displays the total budgets and total spent*/
    return (
        <div>
            {budgetList?.length > 0 ?

                <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/*Total budgets*/}
                    <div className="h-30 p-7 border rounded-lg flex items-center justify-between">
                        <div>
                            <h2 className="text-sm ">Total Budgets</h2>
                            <h2 className="text-2xl font-bold">${totalBudgets}</h2>
                        </div>
                        <PiggyBank className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                    </div>
                    {/*Total spent*/}
                    <div className="h-30 p-7 border rounded-lg flex items-center justify-between">
                        <div>
                            <h2 className="text-sm ">Total Spent</h2>
                            <h2 className="text-2xl font-bold">${totalSpend}</h2>
                        </div>
                        <ReceiptText className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                    </div>
                    {/*Number of budgets*/}
                    <div className="h-30 p-7 border rounded-lg flex items-center justify-between">
                        <div>
                            <h2 className="text-sm ">No. of Budgets</h2>
                            <h2 className="text-2xl font-bold">{budgetList?.length || 0}</h2>
                        </div>
                        <Wallet className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                    </div>
                </div>
                :
                /*If there are no budgets show a loading animation*/
                <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3].map((item, index) => (
                        <div key={index} className="h-30 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            }
        </div>
    )
}

export default CardInfo