import {
  Search,
  X,
  LayoutGrid,
  List,
  RefreshCw,
  Folder,
  Film,
  Music,
  Image as ImageIcon,
  FileText,
  Archive,
  Layers,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import type { FileCategory } from "@/services/api";
import { formatBytes } from "@/utils/format";

interface FileControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: FileCategory | "all";
  onCategoryChange: (cat: FileCategory | "all") => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  stats: {
    folderCount: number;
    fileCount: number;
    totalCount: number;
    totalBytes: number;
  };
}

const CATEGORIES: { label: string; value: FileCategory | "all"; icon: typeof Layers }[] = [
  { label: "All", value: "all", icon: Layers },
  { label: "Folders", value: "folder", icon: Folder },
  { label: "Videos", value: "video", icon: Film },
  { label: "Audio", value: "audio", icon: Music },
  { label: "Images", value: "image", icon: ImageIcon },
  { label: "Documents", value: "document", icon: FileText },
  { label: "Archives", value: "archive", icon: Archive },
];

export function FileControls({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing,
  stats,
}: FileControlsProps) {
  return (
    <div className="space-y-3">
      {/* Top row: Search input + Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter files by name or extension..."
            className="pl-9 pr-8 bg-card/80 h-9.5 text-sm rounded-xl border-border"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        {/* View toggle + Refresh */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Quick stats badge */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
            <Badge variant="outline" className="font-mono text-[11px] font-normal py-0.5 px-2 bg-muted/30">
              {stats.folderCount} {stats.folderCount === 1 ? "dir" : "dirs"} • {stats.fileCount} {stats.fileCount === 1 ? "file" : "files"}
              {stats.fileCount > 0 && ` (${formatBytes(stats.totalBytes)})`}
            </Badge>
          </div>

          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
            <Button
              type="button"
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => onViewModeChange("table")}
              title="Table view"
              className={viewMode === "table" ? "bg-card shadow-xs" : ""}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Table view</span>
            </Button>
            <Button
              type="button"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => onViewModeChange("grid")}
              title="Grid view"
              className={viewMode === "grid" ? "bg-card shadow-xs" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onRefresh}
            title="Refresh folder"
            className="rounded-xl"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}`}
            />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Category Pills (Horizontal scrollable on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((item) => {
          const Icon = item.icon;
          const isActive = category === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onCategoryChange(item.value)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
