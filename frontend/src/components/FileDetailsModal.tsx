import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  Calendar,
  HardDrive,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FileIcon } from "./FileIcon";
import {
  downloadURL,
  getFileCategory,
  getFileExtension,
  type FileEntry,
} from "@/services/api";
import { formatBytes, formatExactBytes, formatModified, formatRelativeTime } from "@/utils/format";

interface FileDetailsModalProps {
  entry: FileEntry | null;
  fullPath: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileDetailsModal({
  entry,
  fullPath,
  open,
  onOpenChange,
}: FileDetailsModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);

  if (!entry) return null;

  const category = getFileCategory(entry);
  const extension = getFileExtension(entry.name);
  const downloadLink = downloadURL(fullPath);
  const absoluteDownloadUrl =
    typeof window !== "undefined"
      ? new URL(downloadLink, window.location.origin).href
      : downloadLink;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(absoluteDownloadUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(fullPath);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60 border border-border">
            <FileIcon entry={entry} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate font-semibold text-base sm:text-lg">
              {entry.name}
            </DialogTitle>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="capitalize text-[11px]">
                {category}
              </Badge>
              {extension && (
                <Badge variant="secondary" className="uppercase text-[11px] font-mono">
                  .{extension}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogHeader>

      {/* Media Previews */}
      {category === "image" && (
        <div className="my-3 overflow-hidden rounded-xl border border-border bg-black/10 flex items-center justify-center max-h-64">
          <img
            src={downloadLink}
            alt={entry.name}
            loading="lazy"
            className="h-full max-h-60 w-auto object-contain"
          />
        </div>
      )}

      {category === "audio" && (
        <div className="my-3 p-3 rounded-xl border border-border bg-card">
          <audio controls className="w-full h-10" src={downloadLink} preload="metadata">
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      {category === "video" && (
        <div className="my-3 overflow-hidden rounded-xl border border-border bg-black">
          <video
            controls
            className="w-full max-h-60 object-contain"
            src={downloadLink}
            preload="metadata"
          >
            Your browser does not support video playback.
          </video>
        </div>
      )}

      {/* Metadata list */}
      <div className="my-3 space-y-2 rounded-xl bg-muted/30 p-3.5 border border-border/60 text-xs sm:text-sm">
        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="flex items-center gap-2 text-muted-foreground">
            <HardDrive className="h-4 w-4" />
            File Size
          </span>
          <span className="font-medium text-foreground">
            {formatBytes(entry.size)}{" "}
            <span className="text-muted-foreground text-xs font-mono">
              ({formatExactBytes(entry.size)})
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Modified
          </span>
          <span className="font-medium text-foreground text-right">
            {formatModified(entry.modifiedAt)}{" "}
            <span className="text-muted-foreground text-xs">
              ({formatRelativeTime(entry.modifiedAt)})
            </span>
          </span>
        </div>

        <div className="flex items-start justify-between py-1">
          <span className="flex items-center gap-2 text-muted-foreground shrink-0 mt-0.5">
            <FileText className="h-4 w-4" />
            Path
          </span>
          <span className="font-mono text-xs text-foreground/80 break-all text-right pl-4">
            {fullPath}
          </span>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyPath}
          className="w-full sm:w-auto"
        >
          {copiedPath ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Path Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Path</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCopyLink}
          className="w-full sm:w-auto"
        >
          {copiedLink ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4" />
              <span>Copy Direct Link</span>
            </>
          )}
        </Button>

        <a
          href={downloadLink}
          download={entry.name}
          className="w-full sm:w-auto inline-flex"
        >
          <Button variant="default" size="sm" className="w-full">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </a>
      </DialogFooter>
    </Dialog>
  );
}
