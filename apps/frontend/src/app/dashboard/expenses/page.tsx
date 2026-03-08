import { ExpenseTracker } from "@/components/features/expenses/ExpenseTracker";
import { getExpenses } from "./actions";

export default async function ExpensesPage() {
    const { expenses, balances } = await getExpenses();

    return (
        <div className="h-full pt-8 pb-16">
            <ExpenseTracker expenses={expenses} balances={balances} />
        </div>
    );
}
