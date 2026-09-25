import { Download, Info } from "lucide-react";
import { FileIcon } from "./FileIcon";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import {
  downloadURL,
  getFileCategory,
  getFileExtension,
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

export function FileCard({
  entry,
  parentPath,
  onOpenDirectory,
  onSelectFile,
}: Props) {
  const fullPath = joinPath(parentPath, entry.name);
  const isDir = entry.type === "directory";
  const category = getFileCategory(entry);
  const ext = getFileExtension(entry.name);

  const handleClick = () => {
    if (isDir) {
      onOpenDirectory(fullPath);
    } else {
      onSelectFile(entry, fullPath);
    }
  };

  return (
    <Card
      onClick={handleClick}
      className="group relative cursor-pointer border border-border bg-card transition-all hover:border-foreground/50 hover:bg-accent/40 active:scale-[0.99]"
    >
      <CardContent className="p-3.5 flex flex-col justify-between h-full">
        <div>
          {/* Top row: Icon + Extension Badge */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/60 transition-transform group-hover:scale-105">
              <FileIcon entry={entry} size="lg" />
            </div>
            <div className="flex items-center gap-1">
              {isDir ? (
                <Badge variant="outline" className="text-[10px] uppercase font-semibold text-foreground/80 border-border">
                  Folder
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                  {ext || category}
                </Badge>
              )}
            </div>
          </div>

          {/* Name */}
          <h4
            className="font-medium text-xs sm:text-sm text-foreground line-clamp-2 break-all group-hover:underline underline-offset-2 transition-colors leading-snug mb-1"
            title={entry.name}
          >
            {entry.name}
          </h4>
        </div>

        {/* Footer: Metadata & Actions */}
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex flex-col">
            <span className="font-mono font-medium text-foreground/90">
              {isDir ? "Directory" : formatBytes(entry.size)}
            </span>
            <span
              className="text-[11px] text-muted-foreground"
              title={formatModified(entry.modifiedAt)}
            >
              {formatRelativeTime(entry.modifiedAt)}
            </span>
          </div>

          {!isDir && (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onSelectFile(entry, fullPath)}
                title="File details"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Info className="h-3.5 w-3.5" />
                <span className="sr-only">Details</span>
              </Button>
              <a
                href={downloadURL(fullPath)}
                download={entry.name}
                title="Download"
                className="inline-flex"
              >
                <Button
                  type="button"
                  variant="subtle"
                  size="icon-sm"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only">Download</span>
                </Button>
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
