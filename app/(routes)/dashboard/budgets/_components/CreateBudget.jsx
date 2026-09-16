"use client"

import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';


/* Creating a new budget popup and saving it to the database. */
function CreateBudget({ refreshData }) {

  /*variables for the emoji icon, emoji picker visibility, and input values*/
  const [emojiIcon, setEmojiIcon] = useState('💰');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  /*controls whether the create budget popup is open so it can be closed from code*/
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const onCreateBudget = async () => {
    /*if user is not loaded or user is not available */
    if (!user) {
      toast("User is still loading");
      return;
    }

    const email = user.primaryEmailAddress?.emailAddress;
    try {
      /* Add budget details into table from the input of the user in the form and put it into the budget table in the database */
      const result = await db.insert(Budgets).values({
        name: name,
        amount: amount,
        createdBy: email,
        icon: emojiIcon
        /*return the row that it added the budget */
      }).returning({ insertedId: Budgets.id })
      if (result) {
        refreshData()
        /*close the popup now that the budget has been saved*/
        setOpen(false)
        toast("New budget created successfully!")
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
  /*Create the budget when the user presses enter in either input box*/
  const onEnterKey = (e) => {
    if (e.key === "Enter" && name && amount > 0) {
      onCreateBudget();
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="bg-slate-100 p-10 rounded-lg 
          items-center flex flex-col border border-dashed 
          cursor-pointer hover:shadow-md hover:-translate-y-2 duration-300"
            onClick={() => {
              /* clear old name, amount, and emoji data*/
              setName('');
              setAmount('');
              setOpenEmojiPicker(false);
            }}>
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>

          </div>
        </DialogTrigger>
        <DialogContent>
          {/*Dialog header*/}
          <DialogHeader className="border-b pb-4 border-primary ">
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              Master Your Money One Budgets at a Time
            </DialogDescription>
          </DialogHeader>
          <div>
            {/*emoji pick for budget card*/}
            <h2 className="text-black font-medium my-1">Emoji</h2>
            <Button variant="outline"
              size="lg"
              className="text-lg cursor-pointer hover:shadow-md hover:-translate-y-1 duration-300"
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
                onChange={(e) => setName(e.target.value)}
                onKeyDown={onEnterKey}
              />
            </div>
            <div className="mt-3">
              <h2 className="text-black font-medium my-1">Budget Amount</h2>
              <Input
                type="text"
                inputMode="numeric"
                min="0"
                placeholder="e.g. 200"
                value={amount || ""}
                /*Only allow numbers in the amount input*/
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                onKeyDown={onEnterKey}
              />
            </div>


          </div>
          <DialogFooter className="sm:justify-start border-t border-primary">
            {/*The dialog is closed inside onCreateBudget once the budget is saved*/}
            <Button
              /*Disable the create budget button if either the name or amount is empty and if the amount is not a positive number */
              disabled={!(name && amount > 0)}
              onClick={onCreateBudget}
              className="cursor-pointer hover:shadow-md hover:-translate-y-1 duration-300
              w-full">Create Budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateBudget