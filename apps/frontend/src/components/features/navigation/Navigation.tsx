"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Home, Plus, Smile, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mobileItems = [
  { href: "/dashboard/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/mood", icon: Smile, label: "Mood / XP" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

export function TopNavigation() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      <Link href="/dashboard" className="text-xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-[#FF6EC7] to-[#8B5CF6] bg-clip-text text-transparent">Bondly</span>
      </Link>

      <Button
        aria-label="Add memory"
        variant="ghost"
        size="icon"
        onClick={() => router.push("/dashboard?addMemory=1")}
        className="rounded-full"
        title="Add memory"
      >
        <Plus className="h-5 w-5 text-[#8B5CF6]" />
      </Button>
    </header>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur md:hidden">
      <div className="mx-auto grid h-16 max-w-md grid-cols-4">
        {mobileItems.map((item) => {
          const active = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard/memories");
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center justify-center gap-1 text-[11px]", active ? "text-foreground" : "text-muted-foreground")}>
              <Icon className={cn("h-5 w-5", active && "text-[#FF6EC7]")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopSidebar() {
  return null;
}
