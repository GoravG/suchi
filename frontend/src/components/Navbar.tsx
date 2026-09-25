import { Sun, Moon, HardDrive } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/useTheme";

interface NavbarProps {
  onNavigateHome: () => void;
}

export function Navbar({ onNavigateHome }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background transition-transform group-hover:scale-105">
            <HardDrive className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-foreground">
              Suchi
            </span>
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-border">
              v0.1
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-lg text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
