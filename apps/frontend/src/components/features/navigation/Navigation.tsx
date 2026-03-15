"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Home, MessageCircle, Plus, Settings, User, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mobileItems = [
  { href: "/dashboard/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

const desktopItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/memories", icon: Images, label: "Memories" },
  { href: "/dashboard/chat", icon: MessageCircle, label: "Chat" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/profile/settings", icon: Settings, label: "Settings" },
];

export function TopNavigation() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
      <Link href="/dashboard" className="text-xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-[#FF6EC7] to-[#8B5CF6] bg-clip-text text-transparent">Bondly</span>
      </Link>

      <div className="flex items-center gap-1">
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
        <Button
          aria-label="Open chat"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/chat")}
          className="rounded-full"
          title="Chat"
        >
          <MessageCircle className="h-5 w-5 text-[#8B5CF6]" />
        </Button>
      </div>
    </header>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur md:hidden">
      <div className="mx-auto grid h-16 max-w-md grid-cols-3">
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
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 border-r border-border bg-card/60 p-4 backdrop-blur md:flex md:flex-col">
      <Link href="/dashboard" className="mb-6 px-2 text-2xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-[#FF6EC7] to-[#8B5CF6] bg-clip-text text-transparent">Bondly</span>
      </Link>

      <nav className="space-y-1">
        {desktopItems.map((item) => {
          const active = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard/memories");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[16px] px-3 py-2 text-sm transition-colors",
                active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-[#FF6EC7]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
