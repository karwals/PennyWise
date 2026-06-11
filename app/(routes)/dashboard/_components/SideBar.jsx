import React from 'react'
import{LayoutDashboard, PiggyBank, BanknoteArrowDown, CircleFadingArrowUp, User} from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
/*links for the other pages*/
function SideBar() {
    const menuList=[
        {
            id: 1,
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard"
        },
        {
            id: 2,
            name: "Budgets",
            icon: PiggyBank,
            path: "/dashboard/budgets"
        },
        {
            id: 3,
            name: "Expenses",
            icon: BanknoteArrowDown,
            path: "/dashboard/expenses"
        },
        {
            id: 4,
            name: "Upgrade",
            icon: CircleFadingArrowUp,
            path: "/dashboard/upgrade"
        }
    ]


/*Sidebar with links to the other pages*/
    return (
        <div className="h-screen p-5 border shadow-sm">
            <img src="/logo.svg"
            className="flex gap-2 items-center
                    text-gray-500 font-medium
                    p-5 cursor-pointer rounded-md
                    hover:text-primary hover:bg-primary/20 hover:underline
                    "
            alt="Logo"
            width={160}
            height={100}
            />
            {/* Sidebar links for switching between dashboard sections. */}
            <div className='mt-5'>
                {menuList.map((menu,index)=>(
                    <Link href={menu.path} key={menu.id}>
                    <h2 className="flex gap-2 items-center
                    text-gray-500 font-medium
                    p-5 cursor-pointer rounded-md
                    hover:text-primary hover:bg-primary/20 hover:underline
                    ">
                        <menu.icon/>
                        {menu.name}
                    </h2>
                    </Link>
                ))}
            </div>
            <div className='fixed bottom-10 p-5 flex gap-2 items-center'>
                <UserButton/>
                profile
            </div>
        </div>
    )
}

export default SideBar