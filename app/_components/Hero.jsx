import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-gray-50 flex items-center flex-col">
      <div className="mx-auto max-w-7xl px-4 py-32 
      lg:flex">
        
        <div className="mx-auto max-w-xl text-center">
          
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Master Your Money
            <strong className="block font-extrabold text-primary sm:block">
              One Expense at a Time
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Easily monitor your expenses, set budgets, and understand
            where your money goes all in one place.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            
            <a
              href="#"
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow-2xl hover:bg-primary/60 focus:outline-none sm:w-auto"
            >
              Get Started
            </a>

            <a
              href="#"
              className="block w-full rounded px-12 py-3 text-sm font-medium text-primary shadow-2xl hover:text-primary/60 focus:outline-none sm:w-auto"
            >
              Learn More
            </a>

          </div>
        </div>

      </div>
      <Image src='./PlaceHolder.svg' alt='Dashboard'
      width={1000}
      height={700}
      className='mt-5 rounded-xl border-2'
      />
    </section>
  );
}