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
    Settings
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
    { href: "/dashboard", label: "Chat", icon: MessageCircleHeart },
    { href: "/dashboard/memories", label: "Memories", icon: ImageIcon },
    { href: "/dashboard/mood", label: "Mood", icon: Smile },
    { href: "/dashboard/expenses", label: "Expenses", icon: Wallet },
    { href: "/dashboard/notes", label: "Notes", icon: StickyNote },
    { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/dashboard/profile", label: "Settings", icon: Settings },
];

export function Navigation() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 h-16 shrink-0 z-50 shadow-sm relative">
            <div className="flex items-center">
                <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    Bondly
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
                    <SheetHeader className="p-6 border-b border-slate-100 dark:border-slate-800 text-left">
                        <SheetTitle className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            Menu
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6 gap-2">
                        {navItems.map((item) => {
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
