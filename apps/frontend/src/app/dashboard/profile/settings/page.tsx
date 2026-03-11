import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { RelationshipSettings } from "@/components/features/profile/RelationshipSettings";
import { AccountSettings } from "@/components/features/profile/AccountSettings";
import { AppearanceSettings } from "@/components/features/profile/AppearanceSettings";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SettingsPage() {
    const session = await getAuthSession();
    const userId = session?.user?.id;
    const fetchedUser = userId ? await db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
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
        <div className="h-full overflow-y-auto">
            <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 pb-24">
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/dashboard/profile" className="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl tracking-tight font-bold text-foreground">Settings</h1>
                        <p className="text-muted-foreground mt-1">Manage your relationship and account.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <RelationshipSettings relationship={relationshipData} />
                    <AppearanceSettings />
                    <AccountSettings />
                </div>
            </div>
        </div>
    );
}
