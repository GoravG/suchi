import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileList } from "./FileList";
import type { FileEntry } from "@/services/api";

const mockEntries: FileEntry[] = [
  {
    name: "Documents",
    type: "directory",
    size: 0,
    modifiedAt: "2026-09-25T10:00:00Z",
  },
  {
    name: "report.pdf",
    type: "file",
    size: 2048,
    modifiedAt: "2026-09-25T11:00:00Z",
  },
];

describe("FileList", () => {
  it("renders empty state when there are no entries", () => {
    render(
      <FileList
        path="/"
        entries={[]}
        viewMode="table"
        sortField="name"
        sortDirection="asc"
        onSortChange={vi.fn()}
        onOpenDirectory={vi.fn()}
        onSelectFile={vi.fn()}
      />
    );

    expect(screen.getByText("This folder is empty")).toBeInTheDocument();
  });

  it("renders entries in table mode and triggers callbacks", () => {
    const onOpenDirectory = vi.fn();
    const onSelectFile = vi.fn();

    render(
      <FileList
        path="/"
        entries={mockEntries}
        viewMode="table"
        sortField="name"
        sortDirection="asc"
        onSortChange={vi.fn()}
        onOpenDirectory={onOpenDirectory}
        onSelectFile={onSelectFile}
      />
    );

    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("report.pdf")).toBeInTheDocument();

    // Clicking folder row triggers onOpenDirectory
    fireEvent.click(screen.getByText("Documents"));
    expect(onOpenDirectory).toHaveBeenCalledWith("/Documents");

    // Clicking file row triggers onSelectFile
    fireEvent.click(screen.getByText("report.pdf"));
    expect(onSelectFile).toHaveBeenCalledWith(mockEntries[1], "/report.pdf");
  });

  it("renders entries in grid mode", () => {
    render(
      <FileList
        path="/"
        entries={mockEntries}
        viewMode="grid"
        sortField="name"
        sortDirection="asc"
        onSortChange={vi.fn()}
        onOpenDirectory={vi.fn()}
        onSelectFile={vi.fn()}
      />
    );

    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });
});
