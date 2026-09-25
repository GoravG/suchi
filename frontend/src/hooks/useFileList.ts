import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listFiles,
  type FileEntry,
  type ListFilesResponse,
} from "@/services/api";

export type SortField = "name" | "size" | "modified";
export type SortDirection = "asc" | "desc";

export interface UseFileListOptions {
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export function useFileList(path: string, options: UseFileListOptions = {}) {
  const [data, setData] = useState<ListFilesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { sortField = "name", sortDirection = "asc" } = options;

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listFiles(path, signal);
      setData(res);
    } catch (e: unknown) {
      if (signal?.aborted) return;
      setData(null);
      setError(e instanceof Error ? e.message : "Failed to load directory");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [path]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => {
      controller.abort();
    };
  }, [load]);

  const rawEntries = data?.entries ?? [];

  // Directory statistics
  const stats = useMemo(() => {
    let folderCount = 0;
    let fileCount = 0;
    let totalBytes = 0;

    for (const item of rawEntries) {
      if (item.type === "directory") {
        folderCount++;
      } else {
        fileCount++;
        totalBytes += item.size;
      }
    }

    return {
      folderCount,
      fileCount,
      totalCount: folderCount + fileCount,
      totalBytes,
    };
  }, [rawEntries]);

  // Sorted entries (directories always listed first)
  const entries = useMemo(() => {
    const list = [...rawEntries];

    list.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1;
      }

      let cmp = 0;
      if (sortField === "name") {
        cmp = a.name.localeCompare(b.name, undefined, { sensitivity: "base", numeric: true });
      } else if (sortField === "size") {
        cmp = a.size - b.size;
      } else if (sortField === "modified") {
        cmp = new Date(a.modifiedAt).getTime() - new Date(b.modifiedAt).getTime();
      }

      return sortDirection === "asc" ? cmp : -cmp;
    });

    return list;
  }, [rawEntries, sortField, sortDirection]);

  return {
    data,
    entries,
    stats,
    loading,
    error,
    refetch: () => load(),
  };
}
