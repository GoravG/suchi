import { useCallback, useEffect, useState } from "react";
import { FileBrowser } from "./pages/FileBrowser";
import "./App.css";

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
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Suchi</h1>
        <p className="tagline">Browse mounted files on this host</p>
      </header>
      <main>
        <FileBrowser path={currentPath} onNavigate={navigate} />
      </main>
    </div>
  );
}
