import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
/* defins which pages is allowed*/
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
]);
/*what make it so that you can access only the public pages and not the other ones*/
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};