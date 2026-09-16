"use client"
import React, { useEffect, useState } from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'

/* This is the layout for the dashboard pages. It includes the sidebar and header. 
It also checks if the user has created a budget. If not, it redirects to the budgets page. */
function DashboardLayout({ children }) {
    /* To make sure that the user has created a budget if not then redirect to the budgets page */
    const {user}=useUser();
    const router=useRouter();
    /* Controls whether the sidebar is open on small screens */
    const [sideBarOpen, setSideBarOpen]=useState(false);
    /*make sure that it only once*/
    useEffect(()=>{
        user&&checkUserBudgets();
    },[user])
    
    // Look up the current user's budgets before showing the dashboard.
    const checkUserBudgets=async()=>{
        const result=await db.select()
        .from(Budgets)
        .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress));

        console.log(result);
        if(result.length==0)
        {
            router.replace("/dashboard/budgets");
        }
    }
    /* The layout includes a sidebar that is always visible on medium and large screens, and a hamburger menu that opens the sidebar on small screens. */
    return (
        <div>
            {/* Sidebar for medium and large screens (always visible) */}
            <div className="fixed hidden md:block md:w-64">
                <SideBar/>
            </div>

            {/* Sidebar for small screens (only shows when the hamburger is clicked) */}
            {sideBarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Dark background, clicking it closes the menu */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={()=>setSideBarOpen(false)}
                    />
                    <div className="relative w-64 h-full bg-white">
                        <SideBar onLinkClick={()=>setSideBarOpen(false)}/>
                    </div>
                </div>
            )}

            <div className="md:ml-64">
                <DashboardHeader onMenuClick={()=>setSideBarOpen(true)}/>
                {children}
            </div>
        </div>

    )
}

export default DashboardLayout