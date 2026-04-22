import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

function Header() {
  return (
    <div className='p-5 flex items-center justify-between shadow-2xl border'>
        <Image src={'./logo.svg'}
        alt='logo'
        width={200}
        height={100}
        />
        <Button className='hover:bg-primary/60' size="lg" >Button</Button>
    </div>
  )
}

export default Header