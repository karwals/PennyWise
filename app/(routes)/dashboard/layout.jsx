"use client"
import React, { useState } from 'react'
import SideBar from './_components/SideBar'
import DashboardHeader from './_components/DashboardHeader'

/* This is the layout for the dashboard pages. It includes the sidebar and header. */
function DashboardLayout({ children }) {
    /* Controls whether the sidebar is open on small screens */
    const [sideBarOpen, setSideBarOpen]=useState(false);
    /* The layout includes a sidebar that is always visible on medium and large screens, and a hamburger menu that opens the sidebar on small screens. */
    return (
        <div>
            {/* Sidebar for medium and large screens (always visible) */}
            <div className="fixed hidden lg:block lg:w-64">
                <SideBar/>
            </div>

            {/* Sidebar for small screens (only shows when the hamburger is clicked) */}
            {sideBarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Dark background, clicking it closes the menu */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={()=>setSideBarOpen(false)}
                    />
                    <div className="relative w-64 h-full">
                        <SideBar onLinkClick={()=>setSideBarOpen(false)}/>
                    </div>
                </div>
            )}

            <div className="lg:ml-64">
                <DashboardHeader onMenuClick={()=>setSideBarOpen(true)}/>
                {children}
            </div>
        </div>

    )
}

export default DashboardLayout
