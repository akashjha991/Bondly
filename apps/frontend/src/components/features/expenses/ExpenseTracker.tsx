"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { addExpense } from "@/app/dashboard/expenses/actions";
import { Plus, Receipt, Loader2, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type Expense = {
    id: string;
    amount: number;
    description: string;
    date: Date;
    splitType: "EQUAL" | "FULL" | "CUSTOM";
    paidBy: {
        id: string;
        name: string | null;
    };
};

export function ExpenseTracker({
    expenses,
    balances
}: {
    expenses: Expense[];
    balances: Record<string, number>
}) {
    const { data: session } = useSession();
    const user = session?.user;
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const meId = user?.id || "";
    const partnerId = Object.keys(balances).find((id) => id !== meId) || "partner";

    const myTotalOwed = balances[meId] || 0;
    const partnerTotalOwed = balances[partnerId] || 0;

    // Who owes who logic
    let balanceText = "You are settled up!";
    let balanceAmount = 0;
    let isOwedToMe = false;

    if (myTotalOwed > partnerTotalOwed) {
        balanceAmount = myTotalOwed - partnerTotalOwed;
        balanceText = "Partner owes you";
        isOwedToMe = true;
    } else if (partnerTotalOwed > myTotalOwed) {
        balanceAmount = partnerTotalOwed - myTotalOwed;
        balanceText = "You owe partner";
        isOwedToMe = false;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            await addExpense(formData);
            toast.success("Expense added");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to add expense");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Shared Expenses</h2>
                    <p className="text-slate-500 text-sm">Keep track of your joint spending</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-500 hover:bg-emerald-600">
                            <Plus className="w-4 h-4 mr-2" /> Add Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>New Expense</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">What was this for?</Label>
                                <Input id="description" name="description" placeholder="Groceries, Dinner, etc." required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount ($)</Label>
                                <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="0.00" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="splitType">Split Type</Label>
                                <Select name="splitType" defaultValue="EQUAL">
                                    <SelectTrigger>
                                        <SelectValue placeholder="How to split?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EQUAL">Split equally (50/50)</SelectItem>
                                        <SelectItem value="FULL">They owe me full amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Expense
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Balance Summary Card */}
            <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 overflow-hidden">
                <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                    <ArrowRightLeft className="w-8 h-8 text-emerald-500 mb-4 opacity-50" />
                    <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
                        Current Balance
                    </h3>
                    <div className={`text-4xl md:text-5xl font-bold mb-2 ${isOwedToMe ? 'text-emerald-500' : balanceAmount === 0 ? 'text-slate-500' : 'text-rose-500'}`}>
                        ${balanceAmount.toFixed(2)}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                        {balanceText}
                    </p>
                </CardContent>
            </Card>

            {/* Ledger List */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Receipt className="w-5 h-5" /> Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {expenses.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">No expenses logged yet.</div>
                        ) : (
                            expenses.map((expense) => {
                                const isPayerMe = expense.paidBy.id === meId;
                                const dateFmt = format(new Date(expense.date), "MMM d, yyyy");

                                return (
                                    <div key={expense.id} className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">{expense.description}</span>
                                            <span className="text-xs text-slate-500">{isPayerMe ? "You" : expense.paidBy.name} paid • {dateFmt}</span>
                                        </div>
                                        <div className="text-right flex flex-col">
                                            <span className="font-bold">${expense.amount.toFixed(2)}</span>
                                            <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full w-fit self-end mt-1">
                                                {expense.splitType}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
