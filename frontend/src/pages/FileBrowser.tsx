import { useCallback, useEffect, useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FileList } from "../components/FileList";
import { listFiles, type ListFilesResponse } from "../services/api";

type Props = {
  path: string;
  onNavigate: (path: string) => void;
};

export function FileBrowser({ path, onNavigate }: Props) {
  const [data, setData] = useState<ListFilesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listFiles(path);
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Failed to load directory");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="browser">
      <Breadcrumbs path={path} onNavigate={onNavigate} />

      {loading && <p className="status">Loading…</p>}
      {!loading && error && (
        <div className="error-box" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => void load()}>
            Retry
          </button>
        </div>
      )}
      {!loading && !error && data && (
        <FileList path={data.path} entries={data.entries} onOpenDirectory={onNavigate} />
      )}
    </section>
  );
}
