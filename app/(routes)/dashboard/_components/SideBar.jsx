import React from 'react'
import{LayoutDashboard, PiggyBank, BanknoteArrowDown} from 'lucide-react'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
/*links for the other pages*/
function SideBar({ onLinkClick }) {
    const { user } = useUser();

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
    ]


/*Sidebar with the links to the other pages from above*/
    return (
        <div className=" relative h-screen p-5 border shadow-sm bg-white">
            {/* Logo takes you back to the landing page */}
            <Link href="/" onClick={onLinkClick}>
                <img
                href="/"
                src="/logo.svg"
                className="flex gap-2 items-center
                        text-gray-500 font-medium
                        p-5 cursor-pointer rounded-md
                        hover:text-primary hover:bg-primary/20 hover:underline active:scale-95"
                alt="Logo"
                width={160}
                height={100}
                />
            </Link>
            {/* Sidebar links for switching between dashboard sections. */}
            <div className='mt-5'>
                {menuList.map((menu,index)=>(
                    <Link href={menu.path} key={menu.id} onClick={onLinkClick}>
                    <h2 className="flex gap-2 items-center
                    text-gray-500 font-medium
                    p-5 cursor-pointer rounded-md
                    hover:text-primary hover:bg-primary/20 hover:underline active:scale-95">
                        <menu.icon/>
                        {menu.name}
                    </h2>
                    </Link>
                ))}
            </div>
            <div className="absolute bottom-10 left-0 right-0 p-5 
            flex gap-2 items-center uppercase font-bold 
            border-t-2 border-primary border-dashed">
                <UserButton alt="User profile"/>
                {user?.username}
            </div>
        </div>
    )
}

export default SideBar