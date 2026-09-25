import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "right" | "bottom";
}

export function Sheet({
  open,
  onOpenChange,
  children,
  side = "bottom",
}: SheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      {/* Content */}
      <div
        className={cn(
          "relative z-50 bg-card p-6 shadow-2xl border-border transition ease-in-out duration-300",
          side === "bottom" &&
            "fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t overflow-y-auto animate-in slide-in-from-bottom",
          side === "right" &&
            "fixed inset-y-0 right-0 h-full w-full max-w-md border-l animate-in slide-in-from-right overflow-y-auto"
        )}
      >
        {/* Mobile drag handle indicator */}
        {side === "bottom" && (
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        )}
        {children}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}
