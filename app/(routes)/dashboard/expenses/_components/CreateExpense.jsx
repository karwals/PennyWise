import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import React, { useState } from 'react'
import { toast } from 'sonner';

/*Create expense form */
function CreateExpense({ budgetId, user, refreshData }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    /*
    Add new expense to the database and if it is successful, refresh the
    data and sends a toast and if not successfull sends a fail toast
    */
    const addNewExpense = async () => {
        try {
            const result = await db.insert(Expenses).values({
                name: name,
                amount: amount,
                budgetId: budgetId,
            }).returning({ insertedId: Budgets.id })
            if (result) {
                refreshData()
                setName("");
                setAmount("");
                toast("New expense created successfully!")
            }
            else {
                toast.error("Failed to create new expense")
            }
        }
        /*If there is an error while creating the expense */
        catch (error) {
            toast.error("Failed to create new expense")
        }
    }
    return (
        <div>

            <div className="border p-5 rounded-lg">
                <h2 className="text-2xl font-bold text-primary">Create Expense</h2>
                {/*The place for the expense details input */}
                <div className="mt-3">
                    <h2 className="text-black font-medium my-1">Expense Name</h2>
                    <Input
                        placeholder="e.g. New Couch"
                        value={name || ""}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && name && amount > 0) {
                                addNewExpense();
                            }
                        }}
                    />
                </div>
                <div className="mt-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-black font-medium my-1">Expense Amount</h2>
                        <p className="text-sm text-gray-500">//Do not include the dollar sign!</p>
                    </div>
                    <Input
                        type="text"
                        inputMode="numeric"
                        min="0"
                        placeholder="e.g. 200"
                        value={amount || ""}
                        /*Only allow numbers in the amount input*/
                        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && name && amount > 0) {
                                addNewExpense();
                            }
                        }}
                    />
                </div>
                <Button
                    /*Disable the create expense button if either the name or amount is empty and if the amount is not a positive number */
                    disabled={!(name && amount > 0)}
                    onClick={() => addNewExpense()}
                    className="
                    mt-5 w-full cursor-pointer
                    hover:shadow-md hover:-translate-y-1 duration-300 ">Create Expense</Button>
            </div>
        </div>
    )
}

export default CreateExpense