import { SignIn } from "@clerk/nextjs";
/* sign in page */
export default function Page() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary/10">
            <div className="absolute -inset-100 z-0 flex flex-wrap gap-8 opacity-10 rotate-[-15deg] text-6xl font-bold text-primary pointer-events-none">
                {Array.from({length:20}).map((_,rowIndex)=>(
                    <div
                    key={rowIndex}
                    className={"flex gap-8 whitespace-nowrap"}
                    style={{ marginLeft: `${rowIndex * -20}px` }}
                    >
                        {Array.from({length:10}).map((_,index)=>(
                            <span key={index}>PennyWise</span>
                        ))}
                    </div>
                ))}
            </div>
            <div className="relative z-10">
                <SignIn/>
            </div>
            
        </div>
    );
}