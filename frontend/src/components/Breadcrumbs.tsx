type Props = {
  path: string;
  onNavigate: (path: string) => void;
};

function segmentsFor(path: string): { label: string; path: string }[] {
  if (path === "/") {
    return [{ label: "Home", path: "/" }];
  }
  const parts = path.split("/").filter(Boolean);
  const crumbs = [{ label: "Home", path: "/" }];
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    crumbs.push({ label: part, path: current });
  }
  return crumbs;
}

export function Breadcrumbs({ path, onNavigate }: Props) {
  const segments = segmentsFor(path);

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={seg.path} className="crumb">
            {i > 0 && <span className="sep">/</span>}
            {isLast ? (
              <span className="current">{seg.label}</span>
            ) : (
              <button type="button" className="link" onClick={() => onNavigate(seg.path)}>
                {seg.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
