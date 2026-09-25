export type FileEntry = {
  name: string;
  type: "file" | "directory";
  size: number;
  modifiedAt: string;
};

export type ListFilesResponse = {
  path: string;
  entries: FileEntry[];
};

export type FileCategory =
  | "folder"
  | "video"
  | "audio"
  | "image"
  | "archive"
  | "document"
  | "code"
  | "other";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Fetch files and folders for a given directory path.
 */
export async function listFiles(
  path: string,
  signal?: AbortSignal
): Promise<ListFilesResponse> {
  const params = new URLSearchParams({ path: path || "/" });
  const res = await fetch(`/api/files?${params.toString()}`, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) {
        errorMessage = body.error;
      }
    } catch {
      // Non-JSON response or failed parse
    }
    throw new ApiError(errorMessage, res.status);
  }

  return (await res.json()) as ListFilesResponse;
}

/**
 * Get direct download URL for a file path.
 */
export function downloadURL(path: string): string {
  const params = new URLSearchParams({ path });
  return `/api/files/download?${params.toString()}`;
}

/**
 * Helper to determine category from entry.
 */
export function getFileCategory(entry: FileEntry): FileCategory {
  if (entry.type === "directory") return "folder";

  const ext = getFileExtension(entry.name).toLowerCase();

  // Video formats
  if (["mp4", "mkv", "webm", "avi", "mov", "wmv", "flv", "m4v", "ts"].includes(ext)) {
    return "video";
  }
  // Audio formats
  if (["mp3", "flac", "wav", "m4a", "aac", "ogg", "opus", "wma"].includes(ext)) {
    return "audio";
  }
  // Image formats
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif"].includes(ext)) {
    return "image";
  }
  // Archives
  if (["zip", "tar", "gz", "tgz", "rar", "7z", "bz2", "xz", "iso"].includes(ext)) {
    return "archive";
  }
  // Documents
  if (["pdf", "epub", "mobi", "docx", "doc", "xlsx", "pptx", "txt", "md"].includes(ext)) {
    return "document";
  }
  // Code / Config
  if (
    [
      "json",
      "yaml",
      "yml",
      "xml",
      "html",
      "css",
      "js",
      "ts",
      "tsx",
      "jsx",
      "go",
      "py",
      "sh",
      "rs",
    ].includes(ext)
  ) {
    return "code";
  }

  return "other";
}

export function getFileExtension(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === 0) return "";
  return name.slice(dotIndex + 1);
}

export function joinPath(parent: string, name: string): string {
  if (parent === "/") return `/${name}`;
  return `${parent.replace(/\/+$/, "")}/${name}`;
}
