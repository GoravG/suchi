import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FileControls } from "@/components/FileControls";
import { FileList } from "@/components/FileList";
import { FileSkeleton } from "@/components/FileSkeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { FileDetailsModal } from "@/components/FileDetailsModal";
import { useFileList, type SortField, type SortDirection } from "@/hooks/useFileList";
import { useDebounce } from "@/hooks/useDebounce";
import type { FileCategory, FileEntry } from "@/services/api";

type Props = {
  path: string;
  onNavigate: (path: string) => void;
};

export function FileBrowser({ path, onNavigate }: Props) {
  // Search state
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 200);

  // Category filter state
  const [category, setCategory] = useState<FileCategory | "all">("all");

  // View mode state (persisted in localStorage)
  const [viewMode, setViewMode] = useState<"table" | "grid">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("suchi-view-mode");
      if (saved === "table" || saved === "grid") return saved;
    }
    return "grid";
  });

  const handleViewModeChange = (mode: "table" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("suchi-view-mode", mode);
  };

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Details Modal state
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectFile = (entry: FileEntry, fullPath: string) => {
    setSelectedFile(entry);
    setSelectedFilePath(fullPath);
    setModalOpen(true);
  };

  // File fetching hook
  const { entries, rawEntries, stats, loading, error, refetch } = useFileList(path, {
    search: debouncedSearch,
    category,
    sortField,
    sortDirection,
  });

  const isFiltered = debouncedSearch.trim().length > 0 || category !== "all";

  const handleClearFilters = () => {
    setSearchInput("");
    setCategory("all");
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb Navigation Card */}
      <div className="rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md px-3 sm:px-4 py-2.5 shadow-xs">
        <Breadcrumbs path={path} onNavigate={onNavigate} />
      </div>

      {/* Search & Filter Controls */}
      <FileControls
        search={searchInput}
        onSearchChange={setSearchInput}
        category={category}
        onCategoryChange={setCategory}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onRefresh={() => void refetch()}
        isRefreshing={loading && rawEntries.length > 0}
        stats={stats}
      />

      {/* Main Content Area */}
      {loading && rawEntries.length === 0 ? (
        <FileSkeleton viewMode={viewMode} />
      ) : error ? (
        <ErrorAlert
          message={error}
          onRetry={() => void refetch()}
          onGoBack={path !== "/" ? () => onNavigate("/") : undefined}
        />
      ) : (
        <FileList
          path={path}
          entries={entries}
          viewMode={viewMode}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          onOpenDirectory={onNavigate}
          onSelectFile={handleSelectFile}
          isFiltered={isFiltered}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* File Details & Preview Modal */}
      <FileDetailsModal
        entry={selectedFile}
        fullPath={selectedFilePath}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
