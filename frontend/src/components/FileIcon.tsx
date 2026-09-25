import {
  Folder,
  Film,
  Music,
  Image as ImageIcon,
  Archive,
  FileText,
  FileCode,
  File,
} from "lucide-react";
import { getFileCategory, type FileEntry } from "@/services/api";
import { cn } from "@/lib/utils";

interface FileIconProps {
  entry: FileEntry;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FileIcon({ entry, className, size = "md" }: FileIconProps) {
  const category = getFileCategory(entry);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  }[size];

  if (category === "folder") {
    return (
      <Folder
        className={cn(
          sizeClasses,
          "text-amber-500 fill-amber-500/20 shrink-0",
          className
        )}
      />
    );
  }

  if (category === "video") {
    return (
      <Film
        className={cn(
          sizeClasses,
          "text-indigo-400 fill-indigo-500/10 shrink-0",
          className
        )}
      />
    );
  }

  if (category === "audio") {
    return (
      <Music
        className={cn(
          sizeClasses,
          "text-rose-400 fill-rose-500/10 shrink-0",
          className
        )}
      />
    );
  }

  if (category === "image") {
    return (
      <ImageIcon
        className={cn(
          sizeClasses,
          "text-emerald-400 fill-emerald-500/10 shrink-0",
          className
        )}
      />
    );
  }

  if (category === "archive") {
    return (
      <Archive
        className={cn(
          sizeClasses,
          "text-amber-400 fill-amber-500/10 shrink-0",
          className
        )}
      />
    );
  }

  if (category === "document") {
    return (
      <FileText
        className={cn(
          sizeClasses,
          "text-sky-400 fill-sky-500/10 shrink-0",
          className
        )}
      />
    );
  }

  if (category === "code") {
    return (
      <FileCode
        className={cn(
          sizeClasses,
          "text-teal-400 fill-teal-500/10 shrink-0",
          className
        )}
      />
    );
  }

  return (
    <File
      className={cn(
        sizeClasses,
        "text-muted-foreground shrink-0",
        className
      )}
    />
  );
}
