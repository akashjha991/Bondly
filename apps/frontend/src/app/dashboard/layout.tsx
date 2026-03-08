import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { Navigation } from "@/components/features/navigation/Navigation";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { getProfileStats } from "./profileActions";
import { db } from "@/lib/db";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getAuthSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    const { xp, level, relationshipId } = await getProfileStats();

    return (
        <SocketProvider relationshipId={relationshipId || ""}>
            <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
                <Navigation />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto mb-16 md:mb-0 relative">
                    <div className="mx-auto max-w-5xl h-full p-4 md:p-8 flex flex-col">
                        {relationshipId && <ProfileHeader xp={xp} level={level} />}
                        <div className="flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
            <Toaster position="top-center" richColors />
        </SocketProvider>
    );
}
