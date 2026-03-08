"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function getEvents() {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) return [];

    const events = await db.calendarEvent.findMany({
        where: { relationshipId: session.user.relationshipId },
        orderBy: { date: "asc" },
    });

    return events;
}

export async function addEvent(formData: FormData) {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const isAnniversary = formData.get("isAnniversary") === "true";

    if (!title || !dateStr) throw new Error("Missing required fields");

    const date = new Date(dateStr);

    const newEvent = await db.calendarEvent.create({
        data: {
            title,
            description,
            date,
            isAnniversary,
            creatorId: session.user.id,
            relationshipId: session.user.relationshipId,
        }
    });

    revalidatePath("/dashboard/calendar");
    return newEvent;
}
