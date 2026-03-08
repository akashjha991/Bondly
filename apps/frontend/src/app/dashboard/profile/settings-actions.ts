"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function updateAnniversary(dateStr: string) {
    const response = await fetchWithAuth('/profile/anniversary', {
        method: 'PUT',
        body: JSON.stringify({ dateStr }),
    });

    if (!response.ok) {
        throw new Error("Failed to update anniversary");
    }

    revalidatePath("/dashboard/profile");
    return { success: true };
}

export async function disconnectPartner() {
    const response = await fetchWithAuth('/profile/disconnect', {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error("Failed to disconnect from partner");
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: true };
}

export async function deleteAccount() {
    const response = await fetchWithAuth('/profile/account', {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error("Failed to delete account");
    }

    // The frontend will handle NextAuth signOut
    return { success: true };
}
