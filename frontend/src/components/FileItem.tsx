import type { FileEntry } from "../services/api";
import { downloadURL } from "../services/api";
import { formatBytes, formatModified } from "../utils/format";

type Props = {
  entry: FileEntry;
  parentPath: string;
  onOpenDirectory: (path: string) => void;
};

function joinPath(parent: string, name: string): string {
  if (parent === "/") return `/${name}`;
  return `${parent}/${name}`;
}

function iconFor(entry: FileEntry): string {
  if (entry.type === "directory") return "📁";
  const lower = entry.name.toLowerCase();
  if (/\.(mp4|mkv|webm|mov)$/.test(lower)) return "🎬";
  if (/\.(zip|tar|gz|7z|rar)$/.test(lower)) return "📦";
  return "📄";
}

export function FileItem({ entry, parentPath, onOpenDirectory }: Props) {
  const fullPath = joinPath(parentPath, entry.name);
  const isDir = entry.type === "directory";

  return (
    <tr className="file-row">
      <td className="name-cell">
        {isDir ? (
          <button type="button" className="row-button" onClick={() => onOpenDirectory(fullPath)}>
            <span className="icon" aria-hidden>
              {iconFor(entry)}
            </span>
            <span>{entry.name}</span>
          </button>
        ) : (
          <div className="row-static">
            <span className="icon" aria-hidden>
              {iconFor(entry)}
            </span>
            <span>{entry.name}</span>
          </div>
        )}
      </td>
      <td className="size-cell">{isDir ? "—" : formatBytes(entry.size)}</td>
      <td className="date-cell">{formatModified(entry.modifiedAt)}</td>
      <td className="action-cell">
        {!isDir && (
          <a className="download-link" href={downloadURL(fullPath)} download={entry.name}>
            Download
          </a>
        )}
      </td>
    </tr>
  );
}
