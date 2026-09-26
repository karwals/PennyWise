"use client"
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
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
    const [loading, setLoading] = useState(true);
    /*This runs when the user loads*/
    useEffect(() => {
        if (user) loadData()
    }, [user])
    /*Used to get the budget list and all the expenses from the database*/
    const loadData = async () => {
        const email = user?.primaryEmailAddress?.emailAddress
        const [budgets, expenses] = await Promise.all([
            getBudgetList(email),
            getAllExpenses(email)
        ])
        setBudgetList(budgets)
        setExpensesList(expenses)
        setLoading(false)
    }

    /*Dashboard page that shows the user their budget information*/
    return (
        <div className="p-5">
            <h1 className="font-bold text-3xl text-primary pb-1 border-b-4 border-primary">Hi, {user?.username}</h1>
            <p className="text-gray-500">Here is what's happening with your money:</p>
            {/*If the data is still loading show a loading message, if the budget list is empty show a message to add a budget, otherwise show the dashboard information. */}
            {loading ? (
                <p className="mt-7 text-gray-500" role="status">Loading your dashboard...</p>
            ) : budgetList.length === 0 ? (
                <div className="mt-7 rounded-lg border p-6 text-center sm:p-10">
                    <h2 className="text-2xl font-bold text-primary">Please add a budget first</h2>
                    <p className="mt-2 text-gray-500">Create a budget to start tracking your spending.</p>
                    <Link href="/dashboard/budgets" className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 font-medium text-white hover:opacity-90">
                        Add a budget
                    </Link>
                </div>
            ) : (
                <>
                    <CardInfo budgetList={budgetList} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 mt-7 gap-5">
                        <div className="order-2 sm:order-1 sm:col-span-2">
                            <BarChartDashboard budgetList={budgetList} />
                            <h2 className="text-2xl text-primary font-bold mt-5">Recent Expenses</h2>
                            {/*Gives the list of expenses page the users data*/}
                            <ListOfExpenses
                                expensesList={expensesList}
                                refreshData={loadData}
                            />
                        </div>
                        <div className="order-1 sm:order-2">
                            <h2 className="text-2xl text-primary font-bold">Budgets</h2>
                            <div className="grid gap-4">
                                {/*Map through the budget list and display each budget item*/}
                                {budgetList.map((budget) => (
                                    <BudgetItem budget={budget} key={budget.id}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard
