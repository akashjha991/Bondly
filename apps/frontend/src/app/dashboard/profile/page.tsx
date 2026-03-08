import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/features/profile/ProfileForm";
import { RelationshipSettings } from "@/components/features/profile/RelationshipSettings";
import { AccountSettings } from "@/components/features/profile/AccountSettings";
import { AppearanceSettings } from "@/components/features/profile/AppearanceSettings";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await getAuthSession();
    const userId = session?.user?.id;
    const fetchedUser = userId ? await db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bondlyId: true,
            xp: true,
            level: true,
            relationshipId: true,
            relationship: {
                select: {
                    id: true,
                    anniversaryDate: true,
                    users: {
                        where: { id: { not: userId } },
                        select: { id: true, name: true, email: true, image: true }
                    }
                }
            }
        },
    }) : null;

    if (!fetchedUser) {
        redirect("/sign-in");
    }

    const relationshipData = fetchedUser.relationship ? {
        id: fetchedUser.relationship.id,
        anniversaryDate: fetchedUser.relationship.anniversaryDate,
        partner: fetchedUser.relationship.users[0] || null
    } : null;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl tracking-tight font-bold">Settings</h1>
                <p className="text-slate-500 mt-2">Manage your account details and relationship settings.</p>
            </div>

            <ProfileForm initialUser={fetchedUser as any} />

            <RelationshipSettings relationship={relationshipData} />

            <AppearanceSettings />

            <AccountSettings />
        </div>
    );
}
