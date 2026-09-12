import type { FileEntry } from "../services/api";
import { FileItem } from "./FileItem";

type Props = {
  path: string;
  entries: FileEntry[];
  onOpenDirectory: (path: string) => void;
};

function sortEntries(entries: FileEntry[]): FileEntry[] {
  return [...entries].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

export function FileList({ path, entries, onOpenDirectory }: Props) {
  const sorted = sortEntries(entries);

  if (sorted.length === 0) {
    return <p className="empty">This folder is empty.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="file-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Modified</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => (
            <FileItem
              key={entry.name}
              entry={entry}
              parentPath={path}
              onOpenDirectory={onOpenDirectory}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
