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
    LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
    { href: "/dashboard", label: "Chat", icon: MessageCircleHeart },
    { href: "/dashboard/memories", label: "Memories", icon: ImageIcon },
    { href: "/dashboard/mood", label: "Mood", icon: Smile },
    { href: "/dashboard/expenses", label: "Expenses", icon: Wallet },
    { href: "/dashboard/notes", label: "Notes", icon: StickyNote },
    { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function Navigation() {
    const pathname = usePathname();
    return (
        <nav className="flex md:flex-col justify-between items-center md:items-start w-full md:w-64 bg-white dark:bg-slate-900 border-t md:border-r border-slate-200 dark:border-slate-800 p-2 md:p-4 fixed bottom-0 md:static h-16 md:h-screen z-50">
            <div className="hidden md:flex flex-col items-center justify-center w-full mb-8 mt-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Bondly</h1>
            </div>

            <div className="flex md:flex-col w-full justify-around md:justify-start gap-1 md:gap-2 overflow-x-auto md:overflow-visible">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-200 min-w-[4rem] md:w-full",
                                isActive
                                    ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon className="w-5 h-5 md:w-6 md:h-6" />
                            <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="hidden md:flex flex-col gap-2 w-full mt-auto">
                <ThemeToggle isDesktop={true} />
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Log Out
                </Button>
            </div>

            {/* Mobile Theme Toggle */}
            <div className="md:hidden absolute top-[-3rem] right-4">
                <ThemeToggle isDesktop={false} />
            </div>
        </nav>
    );
}
