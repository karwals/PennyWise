/* Run component in browser */
"use client"

import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { Button } from "@/components/ui/button";
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
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';



function CreateBudget() {


  /*hold the selected emoji icon */
  const [emojiIcon,setEmojiIcon]=useState('💰');
  const [openEmojiPicker,setOpenEmojiPicker]=useState(false);

  /*hold the budget name */
  const [name, setName] = useState('');

  /*hold the budget amount */
  const [amount, setAmount] = useState('');

  /*gets the current logged in user */
  const {user}=useUser();

  /* Save new budget to database */
  const onCreatBudget=async()=>{
    /*if user is not loaded or user is not available */
    if (!user) {
      toast("User is still loading");
      return;
    }

    /*get the email address of the current user */
    const email = user.primaryEmailAddress?.emailAddress;
    
    /* Add budget details into table */
    const result=await db.insert(Budgets)
    .values({
      name:name,
      amount:amount,
      createdBy: email,
      icon:emojiIcon
    /*return the row that it added the budget */
    }).returning({insertedId:Budgets.id})
    if(result)
    {
      toast("New budget created successfully!")
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-slate-100 p-10 rounded-md 
          items-center flex flex-col border-2 border-dashed 
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
          <DialogHeader className="border-b pb-4 border-primary ">
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
            Master Your Money One Expense at a Time
            </DialogDescription>
          </DialogHeader>
            <div className = "">
              {/*emoji pick for budget card*/}
              <h2 className="text-black font-medium my-1">Emoji</h2>
              <Button variant="outline"
              size="lg"
              className="text-lg cursor-pointer hover:shadow-md hover:-translate-y-1 duration-300"
              /*Set emoji picker to the opposite of it's current state'*/
              onClick={()=> setOpenEmojiPicker(!openEmojiPicker)}>
              {emojiIcon}</Button>
              <div className="absolute z-50">
                <EmojiPicker
                open={openEmojiPicker}
                onEmojiClick={(e)=>{
                  setEmojiIcon(e.emoji)
                  setOpenEmojiPicker(false)
                }}
                />
              </div>
              {/*the place for the budget name input */}
              <div className='mt-3'>
                <h2 className="text-black font-medium my-1">Budget Name</h2>
                <Input placeholder="e.g. Home Decor" 
                onChange={(e)=>setName(e.target.value)}/>
              </div>
              <div className='mt-3'>
                <h2 className="text-black font-medium my-1">Budget Amount</h2>
                <Input 
                type="number"
                placeholder="e.g. $700"
                onChange={(e)=>setAmount(e.target.value)}/>
              </div>
              
              
            </div>
            <DialogFooter className="sm:justify-start">
              {/*Close the dialog after the budget is created*/}
              <DialogClose asChild>
                <Button
                  /*Disable the create budget button if either the name or amount is empty */
                  disabled={!(name&&amount)}
                  onClick={onCreatBudget}
                
                className='cursor-pointer hover:shadow-md hover:-translate-y-1 duration-300 
                w-full'>Create Budget</Button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateBudget