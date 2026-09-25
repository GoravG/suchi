import { describe, it, expect, vi, beforeEach } from "vitest";
import { copyToClipboard } from "./clipboard";

describe("copyToClipboard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uses navigator.clipboard when available in secure context", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const result = await copyToClipboard("https://example.com/file");
    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith("https://example.com/file");
  });

  it("falls back to document.execCommand when clipboard API is unavailable", async () => {
    // Make navigator.clipboard undefined
    // @ts-expect-error test override
    delete navigator.clipboard;

    const execCommandMock = vi.fn().mockReturnValue(true);
    document.execCommand = execCommandMock;

    const result = await copyToClipboard("fallback-text");
    expect(result).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith("copy");
  });
});
