"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function getMoodHistory(days = 7) {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await db.mood.findMany({
        where: {
            relationshipId: session.user.relationshipId,
            date: { gte: startDate }
        },
        orderBy: { date: "asc" },
        include: {
            user: {
                select: { id: true, name: true, image: true }
            }
        }
    });

    return moods;
}

export async function addMood(emoji: string) {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) throw new Error("Unauthorized");

    // Basic check for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existing = await db.mood.findFirst({
        where: {
            userId: session.user.id,
            date: { gte: startOfDay }
        }
    });

    if (existing) {
        // Update existing for today
        const updated = await db.mood.update({
            where: { id: existing.id },
            data: { emoji, date: new Date() }
        });
        revalidatePath("/dashboard/mood");
        return updated;
    }

    const mood = await db.mood.create({
        data: {
            emoji,
            user: { connect: { id: session.user.id } },
            relationship: { connect: { id: session.user.relationshipId } },
        }
    });

    revalidatePath("/dashboard/mood");
    return mood;
}
