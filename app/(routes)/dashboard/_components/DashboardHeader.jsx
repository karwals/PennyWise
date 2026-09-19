import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import React from 'react'
/*The header for the dashboard pages*/
function DashboardHeader({ onMenuClick }) {
    return (
        <div className="p-5 shadow-md border-b flex justify-between items-center md:hidden">
            {/* Hamburger icon, only shows on small screens */}
            <button onClick={onMenuClick} alt="Open menu">
                <Menu/>
            </button>
            <div>
                <UserButton alt="User profile"/>
            </div>
        </div>
    )
}

export default DashboardHeader