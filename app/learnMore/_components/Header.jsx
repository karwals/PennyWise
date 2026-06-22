import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
/*Top nav bar with the logo and sign-in/sign-out options and if you are signed in the dashboard option */
function Header() {
  return (
    <div className="p-5 flex items-center justify-between shadow-xl border">
      <Image
        href = "/app"
        src="/logo.svg"
        alt="logo"
        width={200}
        height={100}
      />
      
      <Show when="signed-out">
        <Button className="hover:bg-primary/60">
          <Link href="/sign-in">Get Started</Link>
        </Button>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center">
          <Button className="hover:bg-primary/60" style={{margin: '0px 20px 0px 0px'}}>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <UserButton className="center"/>
        </div>
      </Show>
    </div>
  );
}

export default Header;