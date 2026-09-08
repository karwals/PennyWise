"use client"
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'

function EditBudget({ budgetInfo, refreshData }) {
    /*variables for the emoji icon, emoji picker visibility, and input values*/
    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    const [name, setName] = useState();
    const [amount, setAmount] = useState();

    const { user } = useUser();

    /*Set the input values when the budgetInfo changes*/
    useEffect(() => {
        if (budgetInfo) {
            setEmojiIcon(budgetInfo?.icon);
            setName(budgetInfo?.name);
            setAmount(budgetInfo?.amount);
        }
    }, [budgetInfo])
    /*Update the budget in the database and if it happens then refresh the
    data and sends a toast and if not successfull sends a fail toast
    */
    const onCreateBudget = async () => {
        const result = await db.update(Budgets).set({
            name: name,
            amount: amount,
            icon: emojiIcon,
        }).where(eq(Budgets.id, budgetInfo.id))
        /*If the budget is updated successfully refresh the data and send a toast */
        if (result) {
            refreshData()
            toast("Budget updated successfully!")
        }
    }
    return (
        <div>
            <Dialog>
                {/*Edit Budget Button*/}
                <DialogTrigger asChild>
                    <Button className="flex gap-2">
                        <Pencil />
                        Edit
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    {/*Dialog header*/}
                    <DialogHeader className="border-b pb-4 border-primary ">
                        <DialogTitle>Edit Budget</DialogTitle>
                    </DialogHeader>
                    <div>
                        {/*emoji pick for budget card*/}
                        <h2 className="text-black font-medium mt-1">Emoji</h2>
                        <Button variant="outline"
                            size="icon-xl"
                            className="text-3xl cursor-pointer hover:shadow-md hover:-translate-y-1 duration-300"
                            /*Set emoji picker to the opposite of it's current state'*/
                            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                            {emojiIcon}</Button>
                        <div className="absolute z-50">
                            <EmojiPicker
                                open={openEmojiPicker}
                                onEmojiClick={(e) => {
                                    setEmojiIcon(e.emoji)
                                    setOpenEmojiPicker(false)
                                }}
                            />
                        </div>
                        {/*The place for the budget details input */}
                        <div className="mt-3">
                            <h2 className="text-black font-medium my-1">Budget Name</h2>
                            <Input placeholder="e.g. Home Decor"
                                defaultValue={budgetInfo?.name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && name && amount > 0) {
                                        onCreateBudget();
                                    }
                                }}
                            />
                        </div>
                        <div className="mt-3">
                            <h2 className="text-black font-medium my-1">Budget Amount</h2>
                            <Input
                                type="text"
                                inputMode="numeric"
                                min="0"
                                placeholder="e.g. $200"
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
                    </div>
                    <DialogFooter className="sm:justify-start border-t border-primary">
                        {/*Close the dialog after the budget is created*/}
                        <DialogClose asChild>
                            <Button
                                /*Disable the create budget button if either the name or amount is empty and if the amount is not a positive number */
                                disabled={!(name && amount > 0)}
                                onClick={onCreateBudget}
                                className="cursor-pointer hover:shadow-md hover:-translate-y-1 duration-300 
                            w-full">Edit Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget