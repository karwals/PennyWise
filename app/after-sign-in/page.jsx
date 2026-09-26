import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
/*This page is used to redirect the user to the dashboard or the budgets page
depending on if they have a budget or not
If they have a budget they will be redirected to the dashboard
if they don't they will be redirected to the budgets page*/
export default async function AfterSignIn() {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress
    /*If the user is not logged in redirect them to the sign in page*/
    if (!email) redirect('/sign-in')
    /*Get the budgets from the database that are created by the user*/
    const budgets = await db.select({ id: Budgets.id })
        .from(Budgets)
        .where(eq(Budgets.createdBy, email))
        /*Limit the results to 1 because we just need to see if they have any*/
        .limit(1)
    /*If the user has no budgets redirect them to the budgets page if they do then to the dashboard*/
    redirect(budgets.length === 0 ? '/dashboard/budgets' : '/dashboard')
}
