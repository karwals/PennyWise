"use client"
import React, { useEffect } from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'


function DashboardLayout({ children }) {
    /* To make sure that the user has created a budget if not then redirect to the budgets page */
    const {user}=useUser();
    const router=useRouter();
    /*make sure that it only once*/
    useEffect(()=>{
        user&&checkUserBugets();
    },[user])
    
    const checkUserBugets=async()=>{
        const result=await db.select()
        .from(Budgets)
        .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress));

        console.log(result);
        if(result.length==0)
        {
            router.replace('/dashboard/budgets');
        }
    }
    return (
        <div>
            <div className='fixed md:w-64 hidden md:block '> 
                <SideBar/>
            </div>
            <div className='md:ml-64'>
                <DashboardHeader/>
                {children}
            </div>
        </div>

    )
}

export default DashboardLayout