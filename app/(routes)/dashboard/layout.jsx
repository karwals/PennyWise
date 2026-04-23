import React from 'react'
import SideBar from './_components/SideBar'

function DashboardLayout({ children }) {
    return (
        <div>
            <div className='fixed md:w-64 hidden md:block '> 
                <SideBar/>
            </div>
            <div className='md:ml-64 bg-green-200'>
                {children}
            </div>
        </div>

    )
}

export default DashboardLayout