import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div className="p-5 flex items-center justify-between shadow-2xl border">
      <Image
        src={"./logo.svg"}
        alt="logo"
        width={200}
        height={100}
      />

      <Show when="signed-out">
        <Button asChild className="hover:bg-primary/60" size="lg">
          <Link href="/sign-in">Get Started</Link>
        </Button>
      </Show>

      <Show when="signed-in">
        <Button className="hover:bg-primary/60" size="lg" 
        herf="/">
          Dashboard
        </Button>
        <UserButton />
      </Show>
    </div>
  );
}

export default Header;