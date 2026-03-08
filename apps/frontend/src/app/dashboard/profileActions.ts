"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/session";

export async function getProfileStats() {
    const session = await getAuthSession();
    const userId = session?.user?.id;
    if (!userId) return { xp: 0, level: 1, relationshipId: null };

    const user = await db.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true, name: true, image: true, relationshipId: true }
    });

    return user || { xp: 0, level: 1, relationshipId: null };
}

// Global XP Adder Function to be imported by other features
export async function addXp(amount: number, reason: string) {
    const session = await getAuthSession();
    const userId = session?.user?.id;
    if (!userId) return;

    const current = await db.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true }
    });

    if (!current) return;

    const newXp = current.xp + amount;
    // Simple level curve: Every 100 XP is a level
    const newLevel = Math.floor(newXp / 100) + 1;

    await db.$transaction([
        db.xPLog.create({
            data: { userId, amount, reason }
        }),
        db.user.update({
            where: { id: userId },
            data: { xp: newXp, level: newLevel }
        })
    ]);
}
