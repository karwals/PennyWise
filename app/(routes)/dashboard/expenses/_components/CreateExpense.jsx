import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import React, { useState } from 'react'
import { toast } from 'sonner';

function CreateExpense({budgetId, user, refreshData}) {
    const [name, setName] = useState();
    const [amount, setAmount] = useState();

    const addNewExpense = async() => {
        const result = await db.insert(Expenses).values({
            name:name,
            amount:amount,
            budgetId:budgetId,
            createdAt:user?.primaryEmailAddress?.emailAddress
        }).returning({insertedId:Budgets.id})

        console.log(result);
        if(result)
        {
            refreshData()
            toast("New expense created successfully!")
        }
    }
    return (
        <div>
            <div className="bg-slate-100 p-10 rounded-lg 
          items-center flex flex-col border border-dashed 
          cursor-pointer hover:shadow-md hover:-translate-y-2 duration-300"
                onClick={() => {
                    /* clear old name, amount, and emoji data*/
                    setName('');
                    setAmount('');
                }}>
                <h2 className="text-3xl">+</h2>
                <h2>Create New Budget</h2>
            </div>
            <div className='border p-5 rounded-lg'>
                <h2 className="text-2xl font-bold text-primary">Create Expense</h2>
                <div className='mt-3'>
                    <h2 className="text-black font-medium my-1">Expense Name</h2>
                    <Input
                        placeholder="e.g. New Couch"
                        onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='mt-3'>
                    <h2 className="text-black font-medium my-1">Expense Amount</h2>
                    <Input
                        type="number"
                        placeholder="e.g. $200"
                        onChange={(e) => setAmount(e.target.value)} />
                </div>
                <Button
                    /*Disable the create expense button if either the name or amount is empty */
                    disabled={!(name && amount)}
                    onClick={() => addNewExpense()}
                    className="
                    mt-5 w-full cursor-pointer
                    hover:shadow-md hover:-translate-y-1 duration-300 ">Create Expense</Button>
            </div>
        </div>
    )
}

export default CreateExpense