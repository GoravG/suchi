import { ChevronRight, Home, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  path: string;
  onNavigate: (path: string) => void;
};

type Segment = {
  label: string;
  fullPath: string;
};

function buildSegments(path: string): Segment[] {
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  if (!trimmed) return [];

  const pieces = trimmed.split("/");
  const segments: Segment[] = [];
  let acc = "";

  for (const piece of pieces) {
    acc += `/${piece}`;
    segments.push({
      label: piece,
      fullPath: acc,
    });
  }

  return segments;
}

export function Breadcrumbs({ path, onNavigate }: Props) {
  const segments = buildSegments(path);
  const isRoot = segments.length === 0;

  const parentPath = isRoot
    ? "/"
    : segments.length === 1
      ? "/"
      : segments[segments.length - 2].fullPath;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center justify-between gap-2 overflow-hidden py-1"
    >
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth text-sm">
        {/* Parent Directory Button */}
        {!isRoot && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onNavigate(parentPath)}
            title="Go to parent directory"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Go up</span>
          </Button>
        )}

        {/* Root / Home Button */}
        <Button
          type="button"
          variant={isRoot ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onNavigate("/")}
          className={`shrink-0 gap-1.5 font-medium ${
            isRoot
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-4 w-4 text-primary" />
          <span>Root</span>
        </Button>

        {/* Directory Segments */}
        {segments.map((seg, index) => {
          const isLast = index === segments.length - 1;
          return (
            <div key={seg.fullPath} className="flex items-center shrink-0">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 mx-0.5" />
              {isLast ? (
                <span
                  className="rounded-md bg-muted px-2 py-1 font-semibold text-foreground max-w-[180px] sm:max-w-[260px] truncate"
                  title={seg.label}
                  aria-current="location"
                >
                  {seg.label}
                </span>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(seg.fullPath)}
                  className="h-7 px-2 text-muted-foreground hover:text-foreground max-w-[140px] sm:max-w-[200px] truncate"
                  title={seg.label}
                >
                  <span className="truncate">{seg.label}</span>
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
