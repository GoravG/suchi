import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { FileBrowser } from "@/pages/FileBrowser";

function pathFromLocation(): string {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("path") ?? "/";
  if (!raw.startsWith("/")) return `/${raw}`;
  return raw || "/";
}

function setPathInLocation(path: string) {
  const url = new URL(window.location.href);
  if (path === "/") {
    url.searchParams.delete("path");
  } else {
    url.searchParams.set("path", path);
  }
  window.history.pushState({ path }, "", url);
}

export function App() {
  const [currentPath, setCurrentPath] = useState(() => pathFromLocation());

  useEffect(() => {
    const sync = () => setCurrentPath(pathFromLocation());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const navigate = useCallback((next: string) => {
    setPathInLocation(next);
    setCurrentPath(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Sticky Top Navbar */}
      <Navbar onNavigateHome={() => navigate("/")} />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FileBrowser path={currentPath} onNavigate={navigate} />
      </main>

      {/* Modern subtle footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Suchi • Read-only host media filesystem
          </p>
          <p className="font-mono text-[11px] text-muted-foreground/80">
            Current directory: <span className="text-foreground/80">{currentPath}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
