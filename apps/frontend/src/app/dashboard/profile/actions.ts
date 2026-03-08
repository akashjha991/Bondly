"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name?: string; imageUrl?: string }) {
    const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const { name, imageUrl } = data;

    const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: {
            ...(name ? { name } : {}),
            ...(imageUrl ? { image: imageUrl } : {}),
        },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return { success: true, user: updatedUser };
}
