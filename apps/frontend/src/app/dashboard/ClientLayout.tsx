"use client";

import { usePathname } from "next/navigation";
import { TopNavigation, BottomNavigation } from "@/components/features/navigation/Navigation";
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
            <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
                {children}
            </div>
        );
    }

    return (
        <div className="flex flex-col absolute inset-0 overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Fixed Top Nav */}
            <div className="shrink-0 z-50">
                <TopNavigation xp={xp} level={level} />
            </div>

            {/* Main Content Area strictly bounded between Top and Bottom Navs */}
            <main className="flex-1 relative w-full flex flex-col min-h-0">
                <div className="w-full h-full flex flex-col max-w-5xl mx-auto">
                    <div className="flex-1 w-full h-full relative">
                        {children}
                    </div>
                </div>
            </main>

            {/* Fixed Bottom Nav spacer equivalent for mobile sizing padding */}
            <div className="shrink-0 z-50 h-[calc(3.5rem+env(safe-area-inset-bottom))] sm:h-[calc(4rem+env(safe-area-inset-bottom))] w-full">
                <BottomNavigation />
            </div>
        </div>
    );
}
