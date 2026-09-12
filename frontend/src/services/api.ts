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

export async function listFiles(path: string): Promise<ListFilesResponse> {
  const params = new URLSearchParams({ path });
  const res = await fetch(`/api/files?${params}`);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<ListFilesResponse>;
}

export function downloadURL(path: string): string {
  const params = new URLSearchParams({ path });
  return `/api/files/download?${params}`;
}
