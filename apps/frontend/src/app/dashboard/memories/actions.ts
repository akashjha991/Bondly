"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function getMemories() {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) return [];

    const memories = await db.memory.findMany({
        where: { relationshipId: session.user.relationshipId },
        orderBy: { date: "desc" },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
        },
    });

    return memories;
}

export async function addMemory(formData: FormData, imageUrl: string) {
    try {
        const authSession = await getAuthSession();
        const userId = authSession?.user?.id;
        const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
        const session = user ? { user } : null;
        if (!session?.user?.relationshipId) throw new Error("Unauthorized: No relationship ID");

        const caption = formData.get("caption") as string;
        const dateStr = formData.get("date") as string;

        const memoryDate = dateStr ? new Date(dateStr) : new Date();

        const memory = await db.memory.create({
            data: {
                imageUrl,
                caption: caption || null,
                date: memoryDate,
                user: { connect: { id: session.user.id } },
                relationship: { connect: { id: session.user.relationshipId } },
            },
        });

        revalidatePath("/dashboard/memories");
        return memory;
    } catch (error) {
        console.error("addMemory Server Action Error:", error);
        throw error;
    }
}
