"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { getBudgetList, getAllExpenses } from './_components/budgetQueries';
import CardInfo from './_components/CardInfo';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ListOfExpenses from './expenses/_components/ListOfExpenses';

function Dashboard() {
    const { user } = useUser();
    /*This is the state that holds the expenses list that is fetched from the database. */
    const [expensesList, setExpensesList] = useState([]);
    /*This is the state that holds the budget list that is fetched from the database. */
    const [budgetList, setBudgetList] = useState([]);
    /*This runs when the user loads*/
    useEffect(() => {
        user && loadData()
    }, [user])
    /*Used to get the budget list and all the expenses from the database*/
    const loadData = async () => {
        const email = user?.primaryEmailAddress?.emailAddress
        setBudgetList(await getBudgetList(email))
        setExpensesList(await getAllExpenses(email))
    }

    /*Dashboard page that greets the user and shows them their budget information*/
    return (
        <div className="p-5">
            <h1 className="font-bold text-3xl text-primary pb-1 border-b-4 border-primary">Hi, {user?.username}</h1>
            <p className="text-gray-500">Here is what's happening with your money:</p>

            <CardInfo budgetList={budgetList} />
            <div className="grid grid-cols-1 md:grid-cols-3 mt-7 gap-5">
                <div className="md:col-span-2">
                    <BarChartDashboard
                        budgetList={budgetList}
                    />
                    <h2 className="text-2xl text-primary font-bold mt-5">Recent Expenses</h2>
                    <ListOfExpenses
                        expensesList={expensesList}
                        refreshData={loadData}
                    />
                </div>
                <div>
                    <h2 className="text-2xl text-primary font-bold">Budgets</h2>
                    <div className="grid gap-4">
                        {budgetList.map((budget, index) => (
                            <BudgetItem budget={budget} key={index}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
