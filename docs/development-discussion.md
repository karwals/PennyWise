# PennyWise — Discussion of Development Considerations

**Digital outcome:** PennyWise, a web-based personal budgeting application
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui + Radix UI · Clerk (authentication) · Neon serverless PostgreSQL · Drizzle ORM
**Development period:** April 2026 – September 2026 (15 commits)

> **Note before you submit this.** This is an evidence pack drafted from your actual codebase — every claim is tied to a real file and line. Rewrite it in your own voice before handing it in, and check the "limitations" points yourself, because several of them are unfixed bugs that a marker could ask you about in a moderation conversation. Where a section says *[you need to add this]*, that's something only you can answer (user testing, feedback, your own reasoning).

---

## 1. Aesthetics

### What I considered
The outcome deals with money, which is a subject people find stressful. I wanted the interface to feel calm, clean and trustworthy rather than busy or "gamified", so the visual design had to stay out of the way of the numbers.

### Decisions made and evidence

**A single, deliberate colour system.** Rather than picking colours ad hoc, I defined the entire palette as CSS custom properties in the OKLCH colour space in [globals.css:52-85](../app/globals.css#L52-L85). The primary colour is a green (`oklch(62.231% 0.13181 163.984)`), chosen because green carries associations of money, growth and "safe/on track" in Western financial interfaces. Every accent in the app — buttons, headings, the progress bar, the sidebar hover state — derives from that one token, so the app reads as one product instead of a set of unrelated screens.

**A matched five-step chart ramp.** [globals.css:71-75](../app/globals.css#L71-L75) defines `--chart-1` through `--chart-5` as a single-hue sequential ramp stepping down in lightness (0.845 → 0.432) at the same hue as the primary. This means any future graphs will already sit inside the brand palette instead of clashing with it.

**Typography with a clear hierarchy.** Three typefaces are loaded through `next/font` in [layout.js:2-20](../app/layout.js#L2-L20): Outfit as the display/body sans, Geist, and Geist Mono for figures. Loading them through `next/font/google` self-hosts the files and generates CSS variables, so there is no flash of unstyled text and no third-party font request at runtime.

**Consistent depth and motion.** Interactive cards use the same signature throughout — `hover:shadow-md hover:-translate-y-2 duration-300` on budget cards ([BudgetItem.jsx:12](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx#L12>)) and on the "Create New Budget" tile ([CreateBudget.jsx:67-69](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L67-L69>)). Repeating one motion rule rather than inventing a new one per component is what makes the interface feel coherent.

**A radius scale rather than arbitrary corners.** [globals.css:43-49](../app/globals.css#L43-L49) derives every corner radius from a single `--radius: 0.625rem` by multiplication, so `sm`/`md`/`lg`/`xl` stay proportional.

**Decorative detail with restraint.** The sign-in page ([sign-in/page.jsx:6-18](<../app/sign-in/[[...sign-in]]/page.jsx#L6-L18>)) generates a rotated, 10%-opacity tiled "PennyWise" wordmark as a background. It is `pointer-events-none` so it can never intercept a click on the sign-in form — decoration that cannot interfere with function.

### Limitations and what I would change
- A full dark palette exists in [globals.css:87-119](../app/globals.css#L87-L119) and `next-themes` is installed, but **no theme toggle was ever built**, so the dark styling is unreachable. Half the aesthetic work is currently invisible to users.
- Several components hard-code raw Tailwind colours — `bg-slate-100`, `bg-slate-200`, `text-red-500` in [ListOfExpenses.jsx:21-31](<../app/(routes)/dashboard/expenses/_components/ListOfExpenses.jsx#L21-L31>) — instead of using the design tokens. Those hard-coded greys will not respond to a dark theme, which is exactly the kind of inconsistency the token system was meant to prevent.
- The landing page still uses `PlaceHolder.svg` as the product screenshot ([Hero.jsx:44](../app/_components/Hero.jsx#L44)), so first-time visitors never actually see the product.

---

## 2. Functionality

### What I considered
The core requirement was a working two-level model: a user creates **budgets** (a spending category with a limit) and records **expenses** against them, and the app calculates what is left. Everything had to persist between sessions and be private to each user.

### Decisions made and evidence

**A relational data model with a foreign key.** [schema.js](../utils/schema.js) defines two tables. `Expenses.budgetId` is declared as `integer("budgetId").references(() => Budgets.id)` ([schema.js:14](../utils/schema.js#L14)), which enforces at the database level that an expense cannot exist without a valid parent budget. Choosing a relational database over, say, browser local storage means data survives device changes and cannot be edited by the user in DevTools.

**Aggregation done in SQL, not JavaScript.** Totals are calculated by the database using a `LEFT JOIN` with `SUM` and `COUNT` ([BudgetList.jsx:21-31](<../app/(routes)/dashboard/budgets/_components/BudgetList.jsx#L21-L31>)):

```js
.select({ ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem:  sql`count(${Expenses.id})`.mapWith(Number) })
.leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
.groupBy(Budgets.id)
```

A `LEFT JOIN` (not an inner join) was necessary so a brand-new budget with zero expenses still appears in the list. Doing the maths in SQL means one round trip instead of fetching every expense row and summing them in the browser.

**Full CRUD coverage.** Create ([CreateBudget.jsx:43-49](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L43-L49>)), Read ([BudgetList.jsx:20-33](<../app/(routes)/dashboard/budgets/_components/BudgetList.jsx#L20-L33>)), Update ([EditBudget.jsx:44-55](<../app/(routes)/dashboard/expenses/_components/EditBudget.jsx#L44-L55>)) and Delete ([expenses/[id]/page.jsx:66-76](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L66-L76>)) are all implemented for budgets, and create/read/delete for expenses.

**Cascading delete handled in application code.** Because `Expenses` holds a foreign key to `Budgets`, deleting a budget while its expenses still existed would violate referential integrity. `deleteBudget()` therefore deletes the child rows first and only then the parent ([expenses/[id]/page.jsx:66-73](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L66-L73>)) — a deliberate ordering decision, not an accident.

**Error handling on writes.** Database inserts are wrapped in `try/catch` with user-visible feedback either way ([CreateExpense.jsx:16-37](<../app/(routes)/dashboard/expenses/_components/CreateExpense.jsx#L16-L37>)), so a network failure produces "Failed to create new expense" rather than a silently dead button.

**Callback-based refresh.** Every mutating component receives a `refreshData` prop from its parent ([BudgetList.jsx:42-44](<../app/(routes)/dashboard/budgets/_components/BudgetList.jsx#L42-L44>)) and calls it after a successful write, so the totals and the list re-query and stay in sync with the database rather than drifting out of date.

**Route protection at the edge.** [proxy.js](../proxy.js) runs Clerk middleware over every request, whitelists only `/`, `/sign-in(.*)` and `/learnMore`, and calls `auth.protect()` on everything else. Protection therefore happens before any page code runs, rather than being re-implemented per page.

### Limitations and what I would change
These are real, currently-unfixed defects — I would rather identify them accurately than claim the outcome is complete:

| Defect | Evidence | Effect |
|---|---|---|
| Sidebar "Expenses" link is broken | [SideBar.jsx:24](<../app/(routes)/dashboard/_components/SideBar.jsx#L24>) links to `/dashboard/expenses`, but only `expenses/[id]/page.jsx` exists — there is no page at that route | 404 for any user who clicks it |
| `Dashboard` and `Upgrade` pages are stubs | [dashboard/page.jsx](<../app/(routes)/dashboard/page.jsx>), [upgrade/page.jsx](<../app/(routes)/dashboard/upgrade/page.jsx>) render one word of text | Two of the four nav destinations are empty |
| `addNewExpense()` is called but never defined | [CreateBudget.jsx:114](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L114>), [EditBudget.jsx:114](<../app/(routes)/dashboard/expenses/_components/EditBudget.jsx#L114>) | Pressing **Enter** in those fields throws a `ReferenceError` instead of submitting |
| Expenses have no date column | [schema.js:10-15](../utils/schema.js#L10-L15) | The app cannot show spending over time — a significant gap for a budgeting tool |
| `Budgets.amount` is `varchar`, `Expenses.amount` is `numeric` | [schema.js:6](../utils/schema.js#L6) vs [schema.js:13](../utils/schema.js#L13) | Arithmetic like `budget.amount - budget.totalSpend` ([BudgetItem.jsx:32](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx#L32>)) relies on JavaScript type coercion of a string |
| Amounts are integer-only | `e.target.value.replace(/\D/g, "")` strips the decimal point ([CreateExpense.jsx:66](<../app/(routes)/dashboard/expenses/_components/CreateExpense.jsx#L66>)) | Users cannot enter $4.50 |
| Progress bar is not clamped | [BudgetItem.jsx:36](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx#L36>) sets `width: ${percentage}%` | Overspending past 100% overflows the container instead of showing a capped "over budget" state |
| `/learnMore` is whitelisted but doesn't exist | [proxy.js:6](../proxy.js#L6); the "Learn More" button is `href="#"` ([Hero.jsx:34](../app/_components/Hero.jsx#L34)) | Dead link on the landing page |

---

## 3. Usability

### What I considered
The target user is a student, not an accountant. The path from "I just spent $12" to "it's recorded" needed to be as short as possible, because a budgeting app that is slow to use simply stops being used.

### Decisions made and evidence

**Feedback on every action.** Every create, update and delete fires a toast notification via Sonner — success and failure paths both covered ([CreateBudget.jsx:52-61](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L52-L61>), [ListOfExpenses.jsx:14-17](<../app/(routes)/dashboard/expenses/_components/ListOfExpenses.jsx#L14-L17>)). The user is never left wondering whether something worked.

**Error prevention over error messages.** Submit buttons are disabled until the input is actually valid — `disabled={!(name && amount > 0)}` ([CreateExpense.jsx:76](<../app/(routes)/dashboard/expenses/_components/CreateExpense.jsx#L76>), [CreateBudget.jsx:144](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L144>)) — and the amount field filters non-digits as you type. This follows the principle that preventing an invalid state is better than reporting it afterwards.

**Destructive actions are confirmed.** Deleting a budget destroys all of its expenses too, so it is gated behind an `AlertDialog` that states the consequence in plain language: *"This action cannot be undone. This will permanently delete your current budget and remove all of its data from our servers."* ([expenses/[id]/page.jsx:89-101](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L89-L101>)).

**Perceived performance.** Rather than a blank screen while data loads, skeleton placeholders animate in the exact shape of the content that is coming — five card-shaped pulses in the budget grid ([BudgetList.jsx:53-57](<../app/(routes)/dashboard/budgets/_components/BudgetList.jsx#L53-L57>)) and one on the expenses page ([expenses/[id]/page.jsx:111-113](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L111-L113>)).

**Onboarding by redirect.** An empty dashboard teaches a new user nothing, so the layout queries the user's budgets on load and redirects to the budgets page if they have none ([dashboard/layout.jsx:24-34](<../app/(routes)/dashboard/layout.jsx#L24-L34>)). The first-time user lands on the one screen where they can take a useful action.

**Recognition over recall.** Each budget carries a user-chosen emoji ([CreateBudget.jsx:99-105](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L99-L105>)), defaulting to 💰. Scanning for 🍕 is faster than reading "Food" in a list of text labels.

**Information scent on the cards.** [BudgetItem.jsx](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx>) shows the limit, the item count, the amount spent, the amount remaining, *and* a proportional progress bar — so a user can assess a budget at a glance without opening it.

**Sensible ordering and keyboard support.** Budgets sort newest-first ([BudgetList.jsx:31](<../app/(routes)/dashboard/budgets/_components/BudgetList.jsx#L31>)) and expenses likewise ([expenses/[id]/page.jsx:61](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L61>)), matching the expectation that recent items matter most. `inputMode="numeric"` ([CreateExpense.jsx:62](<../app/(routes)/dashboard/expenses/_components/CreateExpense.jsx#L62>)) raises the number pad on mobile keyboards instead of the full QWERTY.

**Responsive grid.** The budget grid reflows `grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3` ([BudgetList.jsx:38-40](<../app/(routes)/dashboard/budgets/_components/BudgetList.jsx#L38-L40>)).

### Limitations and what I would change
- **The mobile experience has no navigation at all.** The sidebar is `hidden md:block` ([dashboard/layout.jsx:38](<../app/(routes)/dashboard/layout.jsx#L38>)) and `DashboardHeader` contains only the Clerk user button ([DashboardHeader.jsx](<../app/(routes)/dashboard/_components/DashboardHeader.jsx>)) — so below 768px a user cannot move between sections. The layout is responsive; the *navigation* is not. This is the single most important usability fix outstanding, and it would be a hamburger menu in the header.
- Deleting an individual expense is **not** confirmed ([ListOfExpenses.jsx:31-33](<../app/(routes)/dashboard/expenses/_components/ListOfExpenses.jsx#L31-L33>)) — one mis-click destroys data with no undo. The confirmation pattern already exists for budgets and should be reused.
- The `EditBudget` name field uses `defaultValue` while its state initialises as `undefined` ([EditBudget.jsx:28](<../app/(routes)/dashboard/expenses/_components/EditBudget.jsx#L28>), [:93](<../app/(routes)/dashboard/expenses/_components/EditBudget.jsx#L93>)), so the Edit button stays disabled until the user retypes the name even though it looks filled in.
- There is no empty state for "no expenses yet" — just a table header with nothing under it.
- *[You need to add this: describe who you tested with, what they struggled with, and what you changed as a result. Even two or three classmates trying to add a budget while you watched is valid evidence, and markers look specifically for "I observed X, so I changed Y."]*

---

## 4. Accessibility

### What I considered
Accessibility means the outcome should work for people using a keyboard only, a screen reader, magnification, or with low vision or colour-blindness. The benchmark is **WCAG 2.2 Level AA**, which is the standard the New Zealand Government Web Accessibility Standard requires of public websites.

### Decisions made and evidence

**Accessible primitives instead of hand-rolled ones.** Choosing shadcn/ui — which is built on Radix UI — was in large part an accessibility decision. The `Dialog` and `AlertDialog` components ([dialog.jsx](../components/ui/dialog.jsx), [alert-dialog.jsx](../components/ui/alert-dialog.jsx)) provide focus trapping, focus restoration on close, `Escape` to dismiss, and the correct `role="dialog"` / `aria-modal` / labelling relationships for free. Building those modals from scratch with a plain `<div>` would almost certainly have produced a keyboard trap.

**Visible focus indicators.** The button variants define `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` ([button.jsx:8](../components/ui/button.jsx#L8)), and the global base layer applies `outline-ring/50` to all elements ([globals.css:122-124](../app/globals.css#L122-L124)). Keyboard users can always see where they are — and `focus-visible` rather than `focus` means the ring appears for keyboard use without appearing on every mouse click.

**Language declared.** `<html lang="en">` ([layout.js:29](../app/layout.js#L29)) tells screen readers which pronunciation rules to use — WCAG 3.1.1.

**Invalid state exposed to assistive technology.** Buttons style `aria-invalid` ([button.jsx:8](../components/ui/button.jsx#L8)), so validation state is communicated programmatically, not only through colour.

**Alt text on images.** Both the hero image ([Hero.jsx:44](../app/_components/Hero.jsx#L44)) and the sidebar logo ([SideBar.jsx:44](<../app/(routes)/dashboard/_components/SideBar.jsx#L44>)) carry `alt` attributes.

**Colour is not the only signal.** The progress bar is reinforced by literal "$X Spend" and "$Y Remaining" text ([BudgetItem.jsx:31-32](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx#L31-L32>)), so a colour-blind user is not relying on the green fill alone.

**Decorative content excluded.** The sign-in background wordmark is `pointer-events-none` ([sign-in/page.jsx:9](<../app/sign-in/[[...sign-in]]/page.jsx#L9>)) so it never intercepts keyboard or pointer focus.

### Limitations and what I would change
Auditing my own work honestly, several WCAG failures remain:

| Issue | Evidence | WCAG criterion |
|---|---|---|
| Delete control is a bare SVG with an `onClick` — not focusable, no accessible name | [ListOfExpenses.jsx:31-33](<../app/(routes)/dashboard/expenses/_components/ListOfExpenses.jsx#L31-L33>) | 2.1.1 Keyboard, 4.1.2 Name/Role/Value |
| "Create New Budget" is a `<div onClick>`, not a `<button>` | [CreateBudget.jsx:67-75](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L67-L75>) | 2.1.1 Keyboard |
| `<h2>` used for table cells, values and labels throughout | [ListOfExpenses.jsx:22-33](<../app/(routes)/dashboard/expenses/_components/ListOfExpenses.jsx#L22-L33>), [BudgetItem.jsx:22-32](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx#L22-L32>) | 1.3.1 Info and Relationships — a screen reader's heading list becomes meaningless |
| The expenses "table" is a CSS grid of divs with no `<table>`, `<th>` or row/column association | [ListOfExpenses.jsx:20-36](<../app/(routes)/dashboard/expenses/_components/ListOfExpenses.jsx#L20-L36>) | 1.3.1 |
| Progress bar has no `role="progressbar"` / `aria-valuenow` | [BudgetItem.jsx:34-38](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx#L34-L38>) | 4.1.2 |
| `text-slate-500` at `text-xs` on white is around 4.6:1 — passes AA for normal text but is very small | [BudgetItem.jsx:31-32](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx#L31-L32>) | 1.4.3 Contrast |
| Toasts are the only confirmation of success and may not be announced | Sonner default config, [layout.js:36](../app/layout.js#L36) | 4.1.3 Status Messages |
| Dark mode / high-contrast styling is unreachable | no theme toggle wired to [globals.css:87](../app/globals.css#L87) | — |
| No skip-to-content link | [dashboard/layout.jsx](<../app/(routes)/dashboard/layout.jsx>) | 2.4.1 Bypass Blocks |

The pattern here is clear and worth stating: **wherever I used a library primitive, accessibility is good; wherever I hand-built an interactive element, it is poor.** The fix in almost every case is to use the semantically correct element — `<button>` instead of `<div onClick>`, `<table>` instead of a grid of divs — rather than to add ARIA on top.

---

## 5. Social considerations

### What I considered
Financial literacy is a recognised issue for young New Zealanders, and most budgeting tools are built for adults with mortgages and salaries rather than students with part-time income. PennyWise is aimed at that gap.

### Points to make
- **Positive social impact.** The outcome lowers the barrier to tracking spending: no bank login, no subscription, no financial jargon. A student can model "$60 for food this fortnight" in about ten seconds. Building a habit of tracking spending early is one of the more evidence-backed contributors to long-term financial capability.
- **Deliberately no bank integration.** I chose manual entry over connecting to bank accounts (via a provider like Akahu). That is a worse user experience — but it means the outcome never holds bank credentials or a full transaction history, and never becomes a target worth attacking. The social cost of a breach in a bank-connected app is far higher than the convenience it buys. This was a conscious trade-off, not an omission.
- **Emoji-led categories are culturally neutral.** Letting the user pick any emoji and name ([CreateBudget.jsx:99-117](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L99-L117>)) instead of shipping fixed categories means the app does not impose one culture's idea of what people spend money on. A user can create "Koha", "Church", "Family remittance" or "Gaming" equally easily.
- **Money is emotionally loaded.** The interface never scolds. There is no red "YOU OVERSPENT" state, no streak to break, no notification nagging. Shame is a poor motivator and a common failure of budgeting apps.
- **Digital divide.** The app requires a modern browser and a reliable internet connection — it does nothing offline, since every read and write hits Neon directly. Users on limited mobile data or intermittent connections are effectively excluded. A future version would use a local cache with background sync.
- **The "Upgrade" page raises a real question.** [upgrade/page.jsx](<../app/(routes)/dashboard/upgrade/page.jsx>) implies a paid tier. Putting basic budgeting behind a paywall would fall hardest on exactly the low-income users who most need to track spending. If I monetised, I would keep all core budgeting free and charge only for conveniences.
- **No advertising, no data sale.** There is no analytics, no tracking pixel and no ad network anywhere in the codebase. Spending data is the most commercially valuable data a person has, and the outcome deliberately does not monetise it.

---

## 6. Ethical considerations

### What I considered
The outcome handles data that is genuinely sensitive — what someone spends money on reveals a great deal about their life. That imposes obligations beyond just "does it work".

### Decisions made and evidence

**Authentication was not built by me, on purpose.** Password hashing, session management, MFA and account recovery are easy to get subtly and dangerously wrong. Delegating to Clerk ([layout.js:33](../app/layout.js#L33), [proxy.js](../proxy.js)) means PennyWise never stores or even sees a password. Recognising the limits of my own expertise on a security-critical component was itself an ethical decision.

**Data minimisation.** The schema stores only what the feature needs: name, amount, icon, and the creator's email ([schema.js](../utils/schema.js)). There is no date of birth, no address, no phone number, no income field, no bank detail. Every field I did not add is a field that cannot leak.

**Honest destructive-action warnings.** The delete dialog states plainly that data is removed "from our servers" ([expenses/[id]/page.jsx:93-94](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L93-L94>)) rather than using a vague "Are you sure?".

**Per-user data isolation was designed in.** Budgets are filtered by `eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress)` ([BudgetList.jsx:28](<../app/(routes)/dashboard/budgets/_components/BudgetList.jsx#L28>)), so the list view shows one user only their own data.

**No dark patterns.** Nothing in the outcome manufactures urgency, hides the cancel button, or makes deletion harder than creation.

### Limitations — two serious ones I found while writing this

**(a) The database credential is exposed to the browser.** The connection string is read from `NEXT_PUBLIC_DATABASE_URL` ([dbConfig.js:5](../utils/dbConfig.js#L5)). In Next.js, any variable prefixed `NEXT_PUBLIC_` is **inlined into the JavaScript bundle sent to the browser**. Because `db` is imported directly into client components (`"use client"` at [CreateBudget.jsx:1](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L1>), [BudgetList.jsx:1](<../app/(routes)/dashboard/budgets/_components/BudgetList.jsx#L1>)), the queries run client-side and the Neon credential ships to every visitor. Anyone who opens DevTools can read it and query the database directly — bypassing Clerk entirely, because the database has no idea who the browser claims to be.

The correct architecture is to move every database call behind Next.js **Server Actions** or **Route Handlers**, rename the variable to `DATABASE_URL` (no `NEXT_PUBLIC_` prefix), and re-derive the user's identity from the Clerk session **on the server** for every query. That is the single most important change the outcome needs.

**(b) The ownership check on the expenses page does not actually apply.** [expenses/[id]/page.jsx:48-49](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L48-L49>) chains two `.where()` calls:

```js
.where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
.where(eq(Budgets.id, params.id))
```

I verified in the Drizzle source (`node_modules/drizzle-orm/pg-core/query-builders/select.js:590`) that `where()` performs `this.config.where = where` — it **assigns** rather than accumulates, so the second call silently discards the first. Only the ID filter survives, meaning any signed-in user could view another user's budget by changing the number in the URL. The same gap exists in `getExpensesList()` ([:57-62](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L57-L62>)) and `deleteBudget()` ([:66-73](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L66-L73>)). The fix is a single combined condition: `.where(and(eq(...), eq(...)))`.

Reporting these accurately matters more than claiming the outcome is secure. Together they mean **PennyWise is not currently safe to deploy with real users' data**, and I would fix both before any public release.

---

## 7. Legal considerations

### What I considered
Which New Zealand legislation applies to an outcome that stores personal financial data.

### Privacy Act 2020
The email address and spending records are "personal information", so the Information Privacy Principles apply:

| Principle | How the outcome addresses it | Gap |
|---|---|---|
| **IPP 1** — collect only what's necessary | Schema holds four fields per budget, three per expense ([schema.js](../utils/schema.js)) | Met |
| **IPP 3** — tell people what you're collecting and why | — | **No privacy policy exists anywhere in the outcome.** This is a legal requirement, not a nicety |
| **IPP 5** — protect it with reasonable safeguards | Clerk auth + route middleware ([proxy.js](../proxy.js)); Neon encrypts in transit and at rest | **Not met** — see the credential exposure and broken ownership filter in §6 |
| **IPP 6** — people can access their information | Users can see their own budgets and expenses in the UI | No export function |
| **IPP 7** — people can correct it | Edit and delete implemented ([EditBudget.jsx](<../app/(routes)/dashboard/expenses/_components/EditBudget.jsx>)) | Expenses can be deleted but not edited |
| **IPP 12** — restrictions on offshore disclosure | Neon and Clerk are overseas providers | Would need to confirm their jurisdictions and comply |
| **IPP 9** — don't keep it longer than needed | — | No account-deletion flow that purges budgets and expenses |

A serious breach would also trigger the **mandatory notification** duty to the Privacy Commissioner and affected individuals under Part 6.

### Other legislation
- **Fair Trading Act 1986** — the landing page claim "Easily monitor your expenses, set budgets, and understand where your money goes all in one place" ([Hero.jsx:19-22](../app/_components/Hero.jsx#L19-L22)) must remain accurate. With the Dashboard page empty and the Expenses nav link broken, "all in one place" is arguably overstated today. Marketing copy has to keep pace with what the product actually does.
- **Financial advice regulation (FMC Act 2013 as amended).** PennyWise records and displays a user's own numbers; it does not recommend products or tell anyone what to do with their money. That keeps it outside the regulated financial-advice regime. Adding an "invest your surplus" or "you should switch KiwiSaver providers" feature would change that analysis and require a licensed provider.
- **Consumer Guarantees Act 1993** would apply if the "Upgrade" tier ever became a paid service — the service would have to be fit for purpose and delivered with reasonable care and skill.
- **GDPR** would apply to any EU-based user, adding rights to erasure and portability that the outcome does not yet implement.
- **Age.** Nothing prevents a user under 16 from signing up, and no parental-consent flow exists — relevant to overseas regimes and worth considering given the target audience.
- **Terms of service of the platforms used.** The outcome depends on Clerk, Neon and Vercel free tiers, all of which have usage limits and terms I am bound by.

### Security good practice already in place
`.env*` and `.env.local` are both gitignored ([.gitignore:36-40](../.gitignore#L36-L40)), and I confirmed no environment file is tracked in the repository — so the Clerk secret key has never been committed to version control.

---

## 8. Intellectual property

### What I considered
Whether I have the right to use every third-party component in the outcome, and who owns what I wrote.

### Third-party code and licences

| Dependency | Licence | Obligation |
|---|---|---|
| Next.js, React, React DOM | MIT | Preserve copyright notice |
| Tailwind CSS v4 | MIT | Preserve copyright notice |
| shadcn/ui | MIT | Source is **copied into** `components/ui/` rather than installed — I own and modify those files, under MIT |
| Radix UI (via shadcn) | MIT | Preserve notice |
| Drizzle ORM / Drizzle Kit | Apache 2.0 | Preserve notice; patent grant included |
| `lucide-react` icons | ISC | Preserve notice |
| `sonner`, `emoji-picker-react`, `moment`, `clsx`, `tailwind-merge` | MIT | Preserve notice |
| **GSAP + SplitText** ([SplitText.jsx](../components/SplitText.jsx)) | GreenSock standard licence — **not** MIT | Since GSAP 3.13 (2025) all plugins including SplitText are free, but under GreenSock's own terms, which I should read rather than assume are MIT |
| Geist / Geist Mono fonts | SIL Open Font Licence | Free to embed; self-hosted via `next/font` ([layout.js:8-15](../app/layout.js#L8-L15)) |
| Outfit font | SIL Open Font Licence | As above |
| Clerk, Neon | Proprietary SaaS | Used under their terms of service on free tiers — not "owned", licensed |

All permissive licences here allow use, modification and distribution, including commercially, provided attribution notices are retained — which they are, inside `node_modules` and the copied component headers. **GSAP is the one dependency that is not MIT** and the one whose terms I should verify explicitly rather than assume.

### My own work
The layout, component structure, data model, business logic, styling decisions and copy are my original work, and copyright vests in me automatically under the **Copyright Act 1994** — no registration required in New Zealand. *[Check your school's policy — some institutions claim or share rights in student work.]*

### Trademark
"PennyWise" is used as the product name and appears in [layout.js:23](../app/layout.js#L23), the logo ([logo.svg](../public/logo.svg)) and the sign-in background. Before any commercial use I would need to search the IPONZ trade mark register, because (a) "Pennywise" is strongly associated with a Stephen King character and (b) other financial products already use variants of the name. For a school project this is not an issue; for a launch it would be.

### Gaps to fix
- **There is no `LICENSE` file** in the repository, so the terms on which anyone else may use my code are undefined.
- **The README is still the unmodified `create-next-app` template** ([README.md](../README.md)) — it documents Next.js, not PennyWise, and provides no attribution or setup instructions of my own.
- No `NOTICE` or attributions page surfaces the third-party licences to end users.

---

## 9. End-user considerations

### Who the end user is
Secondary school and early tertiary students in New Zealand, aged roughly 15–20, with irregular income (part-time work, allowance, one-off gifts) and no experience of formal budgeting. They are phone-first, impatient with setup, and unlikely to persist with anything that takes more than a few seconds per use.

### How that shaped specific decisions

| End-user characteristic | Design response | Evidence |
|---|---|---|
| No accounting vocabulary | Language is plain — "Budget", "Expense", "Spend", "Remaining"; never "debit", "ledger", "reconcile" | [BudgetItem.jsx:31-32](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx#L31-L32>) |
| Won't read instructions | Inputs carry concrete example placeholders — "e.g. Home Decor", "e.g. $200" | [CreateBudget.jsx:110](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L110>), [:125](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L125>) |
| Would abandon a long setup | Sign in → create one budget → start recording. No onboarding wizard, no income declaration, no category setup | [dashboard/layout.jsx:24-34](<../app/(routes)/dashboard/layout.jsx#L24-L34>) |
| Visual, fast scanners | Emoji identity per budget plus a progress bar, so status is readable without reading | [CreateBudget.jsx:27](<../app/(routes)/dashboard/budgets/_components/CreateBudget.jsx#L27>), [BudgetItem.jsx:34-38](<../app/(routes)/dashboard/budgets/_components/BudgetItem.jsx#L34-L38>) |
| Enters amounts on a phone | `inputMode="numeric"` raises the number pad; non-digits stripped automatically | [CreateExpense.jsx:62-66](<../app/(routes)/dashboard/expenses/_components/CreateExpense.jsx#L62-L66>) |
| Makes mistakes | Budgets can be edited and deleted; destructive deletion is confirmed | [EditBudget.jsx](<../app/(routes)/dashboard/expenses/_components/EditBudget.jsx>), [expenses/[id]/page.jsx:89-101](<../app/(routes)/dashboard/expenses/[id]/page.jsx#L89-L101>) |
| Uses shared/family devices | Every session is authenticated and data is scoped per user; sign-out is always reachable via the Clerk user button | [SideBar.jsx:64](<../app/(routes)/dashboard/_components/SideBar.jsx#L64>) |
| Distrusts apps that want bank logins | Manual entry only — no credentials requested | §5 above |

### Where the outcome currently fails its own end user
Being blunt about this is more useful than a list of successes:

1. **It is barely usable on a phone**, which is the primary device for this audience — the navigation disappears below 768px ([dashboard/layout.jsx:38](<../app/(routes)/dashboard/layout.jsx#L38>)).
2. **No cents.** A student's expenses are $4.50 coffees, and the input strips the decimal point ([CreateExpense.jsx:66](<../app/(routes)/dashboard/expenses/_components/CreateExpense.jsx#L66>)).
3. **No dates and no time period.** Budgets don't reset weekly or monthly, and expenses aren't timestamped ([schema.js](../utils/schema.js)) — so "$60 for food" has no timeframe attached, which is most of what makes a budget meaningful.
4. **The Dashboard is empty** ([dashboard/page.jsx](<../app/(routes)/dashboard/page.jsx>)) — the overview that would answer "how am I doing overall?" doesn't exist yet, despite the chart colour tokens being ready for it.
5. **Currency is hard-coded as `$`** throughout, with no locale handling.

### Prioritised next steps
1. Move all database access to server actions and fix the ownership filters (§6) — a correctness and privacy blocker.
2. Add mobile navigation.
3. Add a `date` column to `Expenses` and a period to `Budgets`.
4. Build the Dashboard overview using the existing `--chart-*` tokens.
5. Support decimal amounts; unify the `amount` column types.
6. Fix the semantic HTML and keyboard accessibility issues in §4.
7. Write a privacy policy and a real README.

---

## Summary of the argument

The strongest thing I can say about PennyWise is that **most of its good decisions were architectural rather than cosmetic**: aggregating in SQL rather than JavaScript, delegating authentication to a specialist provider, building on accessible Radix primitives, defining a single token-based design system, and choosing not to touch bank credentials at all.

The clearest lesson from auditing my own work is that **the quality of the outcome tracks exactly with whether I used a well-designed primitive or hand-rolled the solution.** Radix dialogs are accessible; my `<div onClick>` buttons are not. Server-side SQL aggregation is correct; my client-side database access is a security hole. Where I leaned on a tool built by people who had thought hard about the problem, the outcome is solid — and where I improvised, it is not.
