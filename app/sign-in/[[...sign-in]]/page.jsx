import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-primary/10">
            <div className="flex flex-col items-center gap-20">
                <h1 className="text-7xl">PennyWise</h1>
                <SignIn />
            </div>
        </div>
    );
}