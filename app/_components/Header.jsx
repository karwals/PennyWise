import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
/*Top nav bar with the logo and sign-in/sign-out options and if 
you are signed in the dashboard option */
function Header() {
  return (
    <div className="p-5 flex items-center justify-between 
    shadow-md border backdrop-blur-sm bg-white/50">
      <Image
        href="/app"
        src="/logo.svg"
        alt="logo"
        width={200}
        height={100}
      />
      {/*If the user is signed out show the get started button and if they are 
      signed in show the dashboard button and the user profile*/}
      <Show when="signed-out">
        <Button className="hover:bg-primary/60">
          <Link href="/sign-in">Get Started</Link>
        </Button>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center">
          <Button className="hover:bg-primary/60 mr-4">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <UserButton alt="User profile" className="center" />
        </div>
      </Show>
    </div>
  );
}

export default Header;