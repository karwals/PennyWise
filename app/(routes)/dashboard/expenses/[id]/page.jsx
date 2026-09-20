"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm'
import BudgetItem from '../../budgets/_components/BudgetItem'
import CreateExpense from '../_components/CreateExpense'
import ListOfExpenses from '../_components/ListOfExpenses'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LucideChevronLeft, Pencil, Trash } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import EditBudget from '../_components/EditBudget'

/*Expenses page(add and view expenses) */
function ExpensesScreen() {
    /*Get the budget id from the url and the current user */
    const params = useParams()
    const { user } = useUser()
    /*State variables for the budget info and the list of expenses for the selected budget */
    const [budgetInfo, setBudgetInfo] = useState();
    const [expensesList, setExpensesList] = useState([]);
    /*Get the router if i need to redirect the user*/
    const route = useRouter();

    useEffect(() => {
        user && getBudgetInfo()
    }, [user])
    /* Gets the selected budget and its expenses */
    const getBudgetInfo = async () => {
        /* gets the budget info from the database. It also gets the total spend and total item count for the selected budget. */
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets)
            /*Left join the expenses table to get the total spend and total item count for the selected budget */
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            /*Make sure that the budget is only for the one that the current user has made and that it is the selected budget */
            .where(
                and(
                    eq(Budgets.id, Number(params.id)),
                    eq(
                        Budgets.createdBy,
                        user.primaryEmailAddress.emailAddress
                    )
                )
            )
            .groupBy(Budgets.id)
        /*If the budget is not found, redirect to the budgets page */
        if (!result[0]) {
            route.replace("/dashboard/budgets");
            return;
        }
        /* Get the first matching budget from the result list and save it */
        setBudgetInfo(result[0]);

        getExpensesList();
    }

    /* Gets the list of expenses for the selected budget */
    const getExpensesList = async () => {
        const result = await db.select()
            .from(Expenses)
            .where(eq(Expenses.budgetId, params.id))
            .orderBy(desc(Expenses.id))
        setExpensesList(result)
        console.log(result)
    }
    /*Delete the budget and all its expenses from the database */
    const deleteBudget = async () => {
        const deleteExpense = await db.delete(Expenses)
            .where(eq(Expenses.budgetId, params.id))

        if (deleteExpense) {
            const result = await db.delete(Budgets)
                .where(eq(Budgets.id, params.id))
        }
        toast("Budget deleted successfully!")
        route.replace("/dashboard/budgets")
    }


    /*Displays the budget information and the list of expenses for the selected budget */
    return (
        <div className="p-5">
            <div className="flex justify-between items-center pb-1 border-b-4 border-primary">
                <div className="flex items-center">
                    <button onClick={() => route.back()}
                        className="cursor-pointer">
                        <ArrowLeft
                            size={30}
                            strokeWidth={3}
                            className="text-primary hover:scale-80"
                        />
                    </button>
                    <h1 className="font-bold text-3xl text-primary">My Expenses</h1>
                </div>
                <div className="gap-2 flex items-center">
                    {/*Edit budget button that opens a edit popup */}
                    <EditBudget budgetInfo={budgetInfo}
                        refreshData={getBudgetInfo} />
                    {/*Delete budget button with a confirmation dialog */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="flex gap-2" variant="destructive">
                                <Trash />Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your current budget and remove all of its data
                                    from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
                {/*Make sure there is no budget info error and that while the budget info is loading there is a skeleton loader */}
                {budgetInfo ?
                    <BudgetItem
                        budget={budgetInfo}
                    /> :
                    <div>
                        <div className="w-full bg-slate-300 rounded-lg h-36 animate-pulse"></div>
                    </div>}
                <CreateExpense
                    budgetId={params.id}
                    user={user}
                    refreshData={() => getBudgetInfo()}
                />
            </div>
            <div className="mt-6">
                <h2 className="text-2xl text-primary font-bold">Expenses</h2>
                <ListOfExpenses expensesList={expensesList}
                    refreshData={() => getBudgetInfo()} />
            </div>
        </div>
    )
}

export default ExpensesScreen
