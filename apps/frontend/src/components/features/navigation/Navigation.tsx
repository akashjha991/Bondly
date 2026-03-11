"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    CalendarDays,
    Smile,
    User,
    Home,
    PlusCircle,
    MessageCircleHeart,
    LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// --- Top Navigation (Global Header) ---
export function TopNavigation({ xp, level }: { xp?: number, level?: number }) {
    return (
        <nav className="flex md:hidden items-center justify-between w-full bg-background border-b border-border px-4 h-16 shrink-0 z-50 shadow-sm relative">
            <div className="flex items-center">
                <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-bondly-pink to-bondly-purple bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    <Home className="w-6 h-6 text-bondly-pink" />
                    <span>Bondly</span>
                </Link>
            </div>

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full text-foreground/80 hover:text-foreground">
                    <PlusCircle className="h-6 w-6" />
                </Button>
                <Link href="/dashboard/chat">
                    <Button variant="ghost" size="icon" className="hover:bg-accent rounded-full text-foreground/80 hover:text-foreground">
                        <MessageCircleHeart className="h-6 w-6" />
                    </Button>
                </Link>
            </div>
        </nav>
    );
}

// --- Navigation Items ---
const navItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/dashboard/mood", label: "Mood", icon: Smile },
    { href: "/dashboard/profile", label: "Profile", icon: User },
];

// --- Desktop Sidebar (Replaces BottomNav on larger screens) ---
export function DesktopSidebar() {
    const pathname = usePathname();

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = pathname === href || (href === "/dashboard" && pathname === "/dashboard/memories");

        return (
            <Link
                href={href}
                className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group",
                    isActive
                        ? "bg-accent text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
            >
                <Icon
                    className={cn(
                        "w-6 h-6 transition-transform duration-200 group-active:scale-95",
                        isActive ? "text-bondly-pink" : ""
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-sm font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-background h-screen sticky top-0 shrink-0">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-bondly-pink to-bondly-purple bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    <Home className="w-6 h-6 text-bondly-pink" />
                    <span>Bondly</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
                {navItems.map(item => (
                    <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
                ))}
            </nav>

            <div className="px-4 pb-2">
                <Link href="/dashboard/chat" className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group text-muted-foreground hover:bg-accent/50 hover:text-foreground">
                    <MessageCircleHeart className="w-6 h-6 transition-transform duration-200 group-active:scale-95" strokeWidth={2} />
                    <span className="text-sm font-medium">Chat</span>
                </Link>
            </div>

            <div className="p-4 mt-auto border-t border-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 py-6 rounded-2xl transition-all"
                    onClick={() => signOut({ callbackUrl: "/sign-in" })}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Log Out</span>
                </Button>
            </div>
        </aside>
    );
}

// --- Bottom Navigation (Mobile) ---
export function BottomNavigation() {
    const pathname = usePathname();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                setIsKeyboardVisible(true);
            }
        };
        const handleFocusOut = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                setIsKeyboardVisible(false);
            }
        };

        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);

        return () => {
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
        };
    }, []);

    const NavIconLink = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
        const isActive = pathname === href || (href === "/dashboard" && pathname === "/dashboard/memories");

        return (
            <Link
                href={href}
                className={cn(
                    "flex flex-col items-center justify-center w-12 h-14 sm:h-16 transition-colors group",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
            >
                <Icon
                    className={cn(
                        "w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200 group-active:scale-90",
                        isActive && "text-bondly-pink"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                />
            </Link>
        );
    };

    return (
        <div className={cn(
            "md:hidden fixed bottom-0 w-full bg-background border-t border-border z-50 pb-safe shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] transition-transform duration-300",
            isKeyboardVisible ? "translate-y-full" : "translate-y-0"
        )}>
            <div className="flex justify-between items-center h-14 sm:h-16 max-w-md mx-auto px-6 sm:px-8">
                {navItems.map(item => (
                    <NavIconLink key={item.href} href={item.href} icon={item.icon} label={item.label} />
                ))}
            </div>
        </div>
    );
}
