import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { TopNavigation, BottomNavigation } from "@/components/features/navigation/Navigation";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
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
            <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
                <TopNavigation xp={xp || 0} level={level || 1} />

                {/* Main Content Area */}
                {/* Notice the pb layout to leave space for the Bottom Navigation */}
                <main className="flex-1 overflow-hidden flex flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-20 relative w-full">
                    <div className="mx-auto w-full max-w-5xl h-full flex flex-col sm:p-4">
                        <div className="flex-1 overflow-hidden flex flex-col relative w-full h-full">
                            {children}
                        </div>
                    </div>
                </main>

                <BottomNavigation />
            </div>
            <Toaster position="top-center" richColors />
        </SocketProvider>
    );
}
