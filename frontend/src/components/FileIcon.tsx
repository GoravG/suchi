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
    lg: "h-7 w-7",
  }[size];

  if (category === "folder") {
    return (
      <Folder
        className={cn(
          sizeClasses,
          "text-foreground shrink-0 stroke-[1.75]",
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
          "text-foreground/90 shrink-0 stroke-[1.75]",
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
          "text-foreground/90 shrink-0 stroke-[1.75]",
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
          "text-foreground/90 shrink-0 stroke-[1.75]",
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
          "text-foreground/90 shrink-0 stroke-[1.75]",
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
          "text-foreground/90 shrink-0 stroke-[1.75]",
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
          "text-foreground/90 shrink-0 stroke-[1.75]",
          className
        )}
      />
    );
  }

  return (
    <File
      className={cn(
        sizeClasses,
        "text-muted-foreground shrink-0 stroke-[1.75]",
        className
      )}
    />
  );
}
