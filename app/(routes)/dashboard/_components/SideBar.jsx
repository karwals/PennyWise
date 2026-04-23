import React from 'react'
import{LayoutDashboard, PiggyBank, BanknoteArrowDown, CircleFadingArrowUp} from 'lucide-react'
function SideBar() {
    const menuList=[
        {
            id: 1,
            name: "Dashboard",
            icon: LayoutDashboard
        },
        {
            id: 2,
            name: "Budget",
            icon: PiggyBank
        },
        {
            id: 3,
            name: "Expenses",
            icon: BanknoteArrowDown
        },
        {
            id: 4,
            name: "Upgrade",
            icon: CircleFadingArrowUp    
        }
    ]

    return (
        <div className="h-screen p-5 border shadow-sm">
            <img src="/logo.svg" 
            alt="Logo"
            width={160}
            hight={100}
            />
            <div className='mt-5'>
                {menuList.map((menu,index)=>(
                    <h2 className="flex gap-2 item-center
                    text-gray-500 font-medium
                    p-5 cursor-pointer rounded-md
                    hover:text-primary hover:bg-primary/20 hover:underline">
                        <menu.icon/>
                        {menu.name}
                    </h2>
                ))}
            </div>

        </div>
    )
}

export default SideBar