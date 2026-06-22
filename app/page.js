import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div>
      <div className="sticky top-0 z-50">
        <Header/>
      </div>
      <Hero/> 
    </div>
  );
}
