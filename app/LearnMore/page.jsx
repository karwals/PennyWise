import Header from "@/app/_components/Header"
import React from "react"

function Page() {
    return (
        <div>
            <Header/>
            <h1 className="m-5 p-2 font-bold text-3xl text-primary border-b-4 border-primary rounded-lg">About Me</h1>
            <div className= "grid grid-cols-1 md:grid-cols-2 p-5" >
                <div className="">
                    <h2 className="text-2xl text-gray-500 leading-none [text-box:trim-start_cap]">This is a website about howto manage your money</h2>
                </div>
                <div>
                    <h1 className="p-3 text-lg border-4 border-primary border-rounded border-curved rounded-lg">
                        Hi my name Shaurya karwal
                    </h1>
                    <p>
                        I am a student at Scots College and I have made this website to help people manage their money. 
                        I have been interested in finance for a long time and I wanted to create a website that would help people manage their money better. I hope you enjoy using this website and find it helpful.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page