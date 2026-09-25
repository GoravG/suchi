import { LayoutGrid, List, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { formatBytes } from "@/utils/format";

interface FileControlsProps {
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

export function FileControls({
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing,
  stats,
}: FileControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      {/* Directory count and size stats */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge
          variant="outline"
          className="font-mono text-[11px] font-normal py-0.5 px-2.5 bg-muted/40 text-muted-foreground border-border/70"
        >
          {stats.folderCount} {stats.folderCount === 1 ? "folder" : "folders"}
          <span className="mx-1 opacity-50">•</span>
          {stats.fileCount} {stats.fileCount === 1 ? "file" : "files"}
          {stats.fileCount > 0 && (
            <>
              <span className="mx-1 opacity-50">•</span>
              {formatBytes(stats.totalBytes)}
            </>
          )}
        </Badge>
      </div>

      {/* View mode toggle + Refresh button */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5 bg-muted/50 p-0.5 rounded-lg border border-border/60">
          <Button
            type="button"
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => onViewModeChange("table")}
            title="Table view"
            className={`h-7 w-7 rounded-md ${
              viewMode === "table" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span className="sr-only">Table view</span>
          </Button>
          <Button
            type="button"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => onViewModeChange("grid")}
            title="Grid view"
            className={`h-7 w-7 rounded-md ${
              viewMode === "grid" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="sr-only">Grid view</span>
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onRefresh}
          title="Refresh"
          className="h-8 w-8 rounded-lg"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isRefreshing ? "animate-spin text-foreground" : "text-muted-foreground"
            }`}
          />
          <span className="sr-only">Refresh folder</span>
        </Button>
      </div>
    </div>
  );
}
