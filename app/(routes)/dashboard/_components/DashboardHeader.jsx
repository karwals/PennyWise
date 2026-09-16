import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import React from 'react'
/*The header for the budget, expenses, upgrade, and dashboard pages*/
function DashboardHeader({ onMenuClick }) {
    return (
        <div className="p-5 shadow-md border-b flex justify-between items-center">
            {/* Hamburger icon, only shows on small screens */}
            <button onClick={onMenuClick} className="md:hidden" aria-label="Open menu">
                <Menu/>
            </button>
            <div className="ml-auto">
                <UserButton/>
            </div>
        </div>
    )
}

export default DashboardHeader