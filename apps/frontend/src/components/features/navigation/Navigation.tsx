"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    MessageCircleHeart,
    Image as ImageIcon,
    CalendarDays,
    Wallet,
    StickyNote,
    Smile,
    User,
    LogOut,
    Menu,
    Settings,
    Trophy,
    Home
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

// --- Top Navigation (Hamburger Menu) ---
const topNavSecondaryItems = [
    { href: "/dashboard/profile", label: "Profile & Settings", icon: Settings },
    { href: "/dashboard/mood", label: "Mood", icon: Smile },
    { href: "/dashboard/expenses", label: "Expenses", icon: Wallet },
];

export function TopNavigation({ xp, level }: { xp?: number, level?: number }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 h-16 shrink-0 z-50 shadow-sm relative">
            <div className="flex items-center">
                <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    <Home className="w-6 h-6 text-rose-500" />
                    <span>Bondly</span>
                </Link>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col w-[280px] sm:w-[350px] p-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <SheetHeader className="p-6 border-b border-slate-100 dark:border-slate-800 text-left bg-slate-50 dark:bg-slate-900/50">
                        <SheetTitle className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            Menu
                        </SheetTitle>

                        {/* Level & XP injected into the Hamburger Menu */}
                        {level !== undefined && xp !== undefined && (
                            <div className="flex items-center gap-3 mt-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full">
                                    <Trophy className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Level {level}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{xp} XP</p>
                                </div>
                            </div>
                        )}
                    </SheetHeader>

                    <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6 gap-2">
                        {topNavSecondaryItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full",
                                        isActive
                                            ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", isActive ? "text-rose-500" : "")} />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 py-6 rounded-xl transition-all mx-auto"
                            onClick={() => signOut({ callbackUrl: "/sign-in" })}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            <span className="font-semibold">Log Out</span>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </nav>
    );
}

// --- Bottom Navigation (Primary Features) ---
export function BottomNavigation() {
    const pathname = usePathname();

    const NavIconLink = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                className={cn(
                    "flex flex-col items-center justify-center w-16 h-16 transition-colors group",
                    isActive ? "text-rose-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
            >
                <Icon className={cn("w-6 h-6 mb-1 transition-transform group-hover:scale-110", isActive && "fill-rose-500/20")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <div className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 pb-safe shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.5)]">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto relative px-2">

                {/* Left side items */}
                <div className="flex gap-4">
                    <NavIconLink href="/dashboard/memories" icon={ImageIcon} label="Memories" />
                    <NavIconLink href="/dashboard/notes" icon={StickyNote} label="Notes" />
                </div>

                {/* Center Main Action - Chat */}
                <div className="absolute left-1/2 -top-6 -translate-x-1/2 flex justify-center w-16">
                    <Link
                        href="/dashboard"
                        className={cn(
                            "flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 text-white",
                            pathname === "/dashboard"
                                ? "bg-gradient-to-tr from-pink-600 to-rose-500 ring-4 ring-rose-100 dark:ring-rose-900/30"
                                : "bg-gradient-to-tr from-pink-500 to-rose-400"
                        )}
                    >
                        <MessageCircleHeart className="w-7 h-7" />
                    </Link>
                </div>

                {/* Right side item + Spacer to balance layout (4 total items) */}
                <div className="flex gap-4 items-center">
                    <NavIconLink href="/dashboard/calendar" icon={CalendarDays} label="Calendar" />
                    {/* Invisible Spacer matched to the width of one NavIconLink to keep "Chat" strictly centered between 4 items */}
                    <div className="w-16 h-16" />
                </div>

            </div>
        </div>
    );
}
