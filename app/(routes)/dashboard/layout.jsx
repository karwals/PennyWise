"use client"
import React, { useEffect } from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'


function DashboardLayout({ children }) {

    const {user}=useUser();
    
    useEffect(()=>{
        user&&checkUserBugets();
    },[user])

    const checkUserBugets=async()=>{
        const result=await db.select()
        .from(Budgets)
        .where(eq(Budgets.createdby,user?.primaryEmailAddress?.emailAddress));

        console.log(result);
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