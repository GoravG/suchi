import { Download, Info, ChevronRight } from "lucide-react";
import { FileIcon } from "./FileIcon";
import { Button } from "./ui/button";
import {
  downloadURL,
  joinPath,
  type FileEntry,
} from "@/services/api";
import { formatBytes, formatRelativeTime, formatModified } from "@/utils/format";

type Props = {
  entry: FileEntry;
  parentPath: string;
  onOpenDirectory: (path: string) => void;
  onSelectFile: (entry: FileEntry, fullPath: string) => void;
};

export function FileItem({
  entry,
  parentPath,
  onOpenDirectory,
  onSelectFile,
}: Props) {
  const fullPath = joinPath(parentPath, entry.name);
  const isDir = entry.type === "directory";

  const handleRowClick = () => {
    if (isDir) {
      onOpenDirectory(fullPath);
    } else {
      onSelectFile(entry, fullPath);
    }
  };

  return (
    <tr
      onClick={handleRowClick}
      className="group cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/40"
    >
      {/* Name & Icon */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/50 transition-transform group-hover:scale-105">
            <FileIcon entry={entry} size="md" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate font-medium text-foreground text-sm group-hover:underline underline-offset-2 transition-colors">
              {entry.name}
            </span>
            {/* Mobile-only secondary info */}
            <div className="flex items-center gap-2 sm:hidden text-xs text-muted-foreground mt-0.5">
              <span>{isDir ? "Folder" : formatBytes(entry.size)}</span>
              <span>•</span>
              <span>{formatRelativeTime(entry.modifiedAt)}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Size (Hidden on small mobile) */}
      <td className="hidden sm:table-cell py-3 px-4 text-sm text-muted-foreground font-mono">
        {isDir ? (
          <span className="text-muted-foreground/60">—</span>
        ) : (
          formatBytes(entry.size)
        )}
      </td>

      {/* Date Modified (Hidden on tablet/mobile) */}
      <td
        className="hidden md:table-cell py-3 px-4 text-sm text-muted-foreground"
        title={formatModified(entry.modifiedAt)}
      >
        {formatRelativeTime(entry.modifiedAt)}
      </td>

      {/* Action buttons */}
      <td
        className="py-3 px-4 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end gap-1">
          {isDir ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenDirectory(fullPath)}
              title="Open folder"
              className="text-muted-foreground group-hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Open folder</span>
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onSelectFile(entry, fullPath)}
                title="View details & preview"
                className="text-muted-foreground hover:text-foreground"
              >
                <Info className="h-4 w-4" />
                <span className="sr-only">Info</span>
              </Button>
              <a
                href={downloadURL(fullPath)}
                download={entry.name}
                title="Download file"
                className="inline-flex"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
              </a>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
