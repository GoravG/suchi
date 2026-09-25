import { FolderOpen, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { FileItem } from "./FileItem";
import { FileCard } from "./FileCard";
import { Table, TableHeader, TableBody, TableHead, TableRow } from "./ui/table";
import type { FileEntry } from "@/services/api";
import type { SortField, SortDirection } from "@/hooks/useFileList";

type Props = {
  path: string;
  entries: FileEntry[];
  viewMode: "table" | "grid";
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
  onOpenDirectory: (path: string) => void;
  onSelectFile: (entry: FileEntry, fullPath: string) => void;
};

export function FileList({
  path,
  entries,
  viewMode,
  sortField,
  sortDirection,
  onSortChange,
  onOpenDirectory,
  onSelectFile,
}: Props) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-4 text-center bg-card/40">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
          <FolderOpen className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          This folder is empty
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          No files or directories found in this path.
        </p>
      </div>
    );
  }

  // Grid view
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {entries.map((entry) => (
          <FileCard
            key={entry.name}
            entry={entry}
            parentPath={path}
            onOpenDirectory={onOpenDirectory}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    );
  }

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground/40 inline ml-1.5" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 text-foreground inline ml-1.5" />
    ) : (
      <ArrowDown className="h-3 w-3 text-foreground inline ml-1.5" />
    );
  };

  // Table view
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead
              className="cursor-pointer select-none text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => onSortChange("name")}
            >
              Name {renderSortIndicator("name")}
            </TableHead>
            <TableHead
              className="hidden sm:table-cell cursor-pointer select-none text-foreground/80 hover:text-foreground transition-colors w-32"
              onClick={() => onSortChange("size")}
            >
              Size {renderSortIndicator("size")}
            </TableHead>
            <TableHead
              className="hidden md:table-cell cursor-pointer select-none text-foreground/80 hover:text-foreground transition-colors w-40"
              onClick={() => onSortChange("modified")}
            >
              Modified {renderSortIndicator("modified")}
            </TableHead>
            <TableHead className="w-20 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <FileItem
              key={entry.name}
              entry={entry}
              parentPath={path}
              onOpenDirectory={onOpenDirectory}
              onSelectFile={onSelectFile}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
