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
            <div className="flex flex-col absolute inset-0 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                {/* Fixed Top Nav */}
                <div className="shrink-0 z-50">
                    <TopNavigation xp={xp || 0} level={level || 1} />
                </div>

                {/* Main Content Area strictly bounded between Top and Bottom Navs */}
                <main className="flex-1 overflow-hidden relative w-full flex flex-col">
                    <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
                        <div className="flex-1 overflow-hidden w-full h-full relative">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Fixed Bottom Nav spacer equivalent for mobile sizing padding */}
                <div className="shrink-0 z-50 h-[calc(3.5rem+env(safe-area-inset-bottom))] sm:h-[calc(4rem+env(safe-area-inset-bottom))] w-full">
                    <BottomNavigation />
                </div>
            </div>
            <Toaster position="top-center" richColors />
        </SocketProvider>
    );
}
