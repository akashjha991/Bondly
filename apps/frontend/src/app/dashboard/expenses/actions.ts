"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) return { expenses: [], balances: {} };

    const expenses = await db.expense.findMany({
        where: { relationshipId: session.user.relationshipId },
        orderBy: { date: "desc" },
        include: {
            paidBy: { select: { id: true, name: true, image: true } }
        }
    });

    // Calculate balances (who owes whom)
    // Positive balance means the user is owed money
    const balances: Record<string, number> = {};

    expenses.forEach((exp) => {
        let amountOwedToPayer = 0;

        if (exp.splitType === "EQUAL") {
            amountOwedToPayer = exp.amount / 2;
        } else if (exp.splitType === "FULL") {
            amountOwedToPayer = exp.amount; // The other person owes the full amount
        }

        if (!balances[exp.paidById]) balances[exp.paidById] = 0;
        balances[exp.paidById] += amountOwedToPayer;

        // We only have 2 users, but tracking "owed" generically
    });

    return { expenses, balances };
}

export async function addExpense(formData: FormData) {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) throw new Error("Unauthorized");

    const amount = parseFloat(formData.get("amount") as string);
    const description = formData.get("description") as string;
    const splitType = formData.get("splitType") as "EQUAL" | "FULL" | "CUSTOM";

    if (!amount || !description) throw new Error("Missing fields");

    const expense = await db.expense.create({
        data: {
            amount,
            description,
            splitType: splitType || "EQUAL",
            paidById: session.user.id,
            relationshipId: session.user.relationshipId,
        }
    });

    revalidatePath("/dashboard/expenses");
    return expense;
}
