import { SignIn } from "@clerk/nextjs";
/* sign in page */
export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-primary/10">
                <SignIn />
        </div>
    );
}