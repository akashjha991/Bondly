"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ isDesktop = false }: { isDesktop?: boolean }) {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size={isDesktop ? "default" : "icon"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={isDesktop ? "w-full justify-start text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" : "rounded-full"}
        >
            <Sun className="h-5 w-5 md:h-5 md:w-5 mr-0 md:mr-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 md:h-5 md:w-5 mr-0 md:mr-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="hidden md:inline-block">Toggle Theme</span>
        </Button>
    );
}
