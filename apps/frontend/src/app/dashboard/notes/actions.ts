"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function getNotes() {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) return [];

    const notes = await db.note.findMany({
        where: { relationshipId: session.user.relationshipId },
        orderBy: { updatedAt: "desc" },
        include: {
            author: { select: { name: true } }
        }
    });

    return notes;
}

export async function saveNote(id: string | null, title: string, content: string) {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) throw new Error("Unauthorized");

    if (id) {
        const note = await db.note.update({
            where: { id, relationshipId: session.user.relationshipId },
            data: { title, content }
        });
        revalidatePath("/dashboard/notes");
        return note;
    }

    const newNote = await db.note.create({
        data: {
            title,
            content,
            authorId: session.user.id,
            relationshipId: session.user.relationshipId,
        }
    });

    revalidatePath("/dashboard/notes");
    return newNote;
}

export async function deleteNote(id: string) {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.relationshipId) throw new Error("Unauthorized");

    await db.note.delete({
        where: { id, relationshipId: session.user.relationshipId }
    });

    revalidatePath("/dashboard/notes");
}
