import { describe, it, expect } from "vitest";
import {
  getFileCategory,
  getFileExtension,
  joinPath,
  downloadURL,
  type FileEntry,
} from "./api";

describe("api utilities", () => {
  it("determines file categories accurately", () => {
    const makeEntry = (name: string, type: "file" | "directory" = "file"): FileEntry => ({
      name,
      type,
      size: 100,
      modifiedAt: new Date().toISOString(),
    });

    expect(getFileCategory(makeEntry("folder", "directory"))).toBe("folder");
    expect(getFileCategory(makeEntry("movie.mkv"))).toBe("video");
    expect(getFileCategory(makeEntry("movie.mp4"))).toBe("video");
    expect(getFileCategory(makeEntry("song.mp3"))).toBe("audio");
    expect(getFileCategory(makeEntry("photo.jpg"))).toBe("image");
    expect(getFileCategory(makeEntry("photo.png"))).toBe("image");
    expect(getFileCategory(makeEntry("archive.zip"))).toBe("archive");
    expect(getFileCategory(makeEntry("archive.tar.gz"))).toBe("archive");
    expect(getFileCategory(makeEntry("doc.pdf"))).toBe("document");
    expect(getFileCategory(makeEntry("code.go"))).toBe("code");
    expect(getFileCategory(makeEntry("code.tsx"))).toBe("code");
    expect(getFileCategory(makeEntry("random.unknown"))).toBe("other");
  });

  it("extracts file extensions correctly", () => {
    expect(getFileExtension("test.txt")).toBe("txt");
    expect(getFileExtension("archive.tar.gz")).toBe("gz");
    expect(getFileExtension("noextension")).toBe("");
    expect(getFileExtension(".hidden")).toBe("");
  });

  it("joins paths safely", () => {
    expect(joinPath("/", "file.txt")).toBe("/file.txt");
    expect(joinPath("/docs", "file.txt")).toBe("/docs/file.txt");
    expect(joinPath("/docs/", "file.txt")).toBe("/docs/file.txt");
  });

  it("builds valid download URLs", () => {
    expect(downloadURL("/docs/file.txt")).toBe("/api/files/download?path=%2Fdocs%2Ffile.txt");
  });
});
