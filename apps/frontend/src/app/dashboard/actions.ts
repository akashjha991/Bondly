"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function getMessages(limit = 50) {
    const session = await getAuthSession();
    const userId = session?.user?.id;
    if (!userId) return [];

    const user = await db.user.findUnique({ where: { id: userId }, select: { relationshipId: true } });
    if (!user?.relationshipId) return [];

    const messages = await db.message.findMany({
        where: { relationshipId: user.relationshipId },
        include: { sender: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });

    return messages.reverse();
}

export async function sendMessage(content: string) {
    const session = await getAuthSession();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({ where: { id: userId }, select: { relationshipId: true } });
    if (!user?.relationshipId) throw new Error("Unauthorized");

    const message = await db.message.create({
        data: {
            content,
            senderId: userId,
            relationshipId: user.relationshipId,
            status: "SENT"
        },
        include: { sender: { select: { id: true, name: true, image: true } } }
    });

    revalidatePath("/dashboard");
    return message;
}

export async function getMyBondlyId() {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    if (!userId) return "BOND123";

    const user = await db.user.findUnique({ where: { id: userId }, select: { bondlyId: true } });
    return user?.bondlyId || "BOND123";
}

export async function getPartnerInfo() {
    const session = await getAuthSession();
    const userId = session?.user?.id;
    if (!userId) return null;

    const user = await db.user.findUnique({ where: { id: userId }, select: { relationshipId: true } });
    if (!user?.relationshipId) return null;

    const partner = await db.user.findFirst({
        where: { relationshipId: user.relationshipId, id: { not: userId } },
        select: { id: true, name: true, image: true }
    });

    return partner;
}
