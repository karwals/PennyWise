"use client"
import React, { useEffect, useState } from 'react'
import ListOfExpenses from './_components/ListOfExpenses'
import { useUser } from '@clerk/nextjs';
import { getBudgetList, getAllExpenses } from '../_components/budgetQueries';

function page() {
    const { user } = useUser();
    /*This is the state that holds the expenses list that is fetched from the database. */
    const [expensesList, setExpensesList] = useState([]);
    /*This is the state that holds the budget list that is fetched from the database. */
    const [budgetList, setBudgetList] = useState([]);
    /*This runs when the user loads*/
    useEffect(() => {
        user && loadData()
    }, [user])
    /*Used to get all expenses from database that the user had made*/
    const loadData = async () => {
        const email = user?.primaryEmailAddress?.emailAddress
        setBudgetList(await getBudgetList(email))
        setExpensesList(await getAllExpenses(email))
    }

    return (
        <div className="p-5">
            <h1 className="font-bold text-3xl text-primary pb-1 border-b-4 border-primary mb-5">Recent Expenses</h1>
            <ListOfExpenses
                expensesList={expensesList}
                refreshData={loadData}
            />
        </div>
    )
}

export default page