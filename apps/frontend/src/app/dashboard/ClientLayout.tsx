"use client";

import { usePathname } from "next/navigation";
import { TopNavigation, BottomNavigation, DesktopSidebar } from "@/components/features/navigation/Navigation";
import { ReactNode } from "react";

interface ClientLayoutProps {
    children: ReactNode;
    xp: number;
    level: number;
}

export function ClientLayout({ children, xp, level }: ClientLayoutProps) {
    const pathname = usePathname();
    const isChatScreen = pathname === "/dashboard/chat";

    if (isChatScreen) {
        return (
            <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
                {/* Keep sidebar on desktop for chat, hide on mobile */}
                <DesktopSidebar />
                <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col min-w-0">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
            <DesktopSidebar />

            <div className="flex flex-col flex-1 min-w-0 relative">
                <TopNavigation xp={xp} level={level} />

                <main className="flex-1 relative w-full flex flex-col min-h-0 overflow-y-auto">
                    <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
                        <div className="flex-1 w-full h-full relative">
                            {children}
                        </div>
                    </div>
                </main>

                <div className="md:hidden shrink-0 z-50 h-[calc(3.5rem+env(safe-area-inset-bottom))] sm:h-[calc(4rem+env(safe-area-inset-bottom))] w-full">
                    <BottomNavigation />
                </div>
            </div>
        </div>
    );
}
