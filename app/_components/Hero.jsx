import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Show } from "@clerk/nextjs";
import Link from "next/link";
/* The main part of the landing page for the website*/
export default function Hero() {
  return (
    <div className="bg-gray-50 flex items-center flex-col">
      <div className="mx-auto max-w-7xl px-4 py-32 
      lg:flex">
        {/*The text on the landing page*/}
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Master Your Money
            <a className="block font-extrabold text-primary sm:block">
              One Expense at a Time
            </a>
          </h1>
          <p className="mt-4 sm:text-xl">
            Easily monitor your expenses, set budgets, and understand
            where your money goes all in one place.
          </p>
          {/*The buttons on the landing page*/}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {/*If the user is signed out show the get started button and if they are signed in show the dashboard button and the user profile*/}
            <Show when="signed-out">
              <Button size="xl" className="text-xl hover:bg-primary/60">
                <Link href="/sign-in">Get Started</Link>
              </Button>
            </Show>
            <Show when="signed-in">
              <Button size="xl" className="w-full text-xl hover:bg-primary/60">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </Show>

          </div>
        </div>
      </div>
      {/*The image on the landing page*/}
      <Image src="./Dashboard.png" alt="Dashboard"
        width={1000}
        height={700}
        className="mt-5 rounded-xl border-2"
      />
    </div>
  );
}