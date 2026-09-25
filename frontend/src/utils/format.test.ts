import { describe, it, expect } from "vitest";
import {
  formatBytes,
  formatExactBytes,
  formatModified,
  formatRelativeTime,
} from "./format";

describe("formatBytes", () => {
  it("formats zero bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats small byte sizes", () => {
    expect(formatBytes(512)).toBe("512 B");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1.00 KB");
    expect(formatBytes(10240)).toBe("10.0 KB");
    expect(formatBytes(153600)).toBe("150 KB");
  });

  it("formats megabytes", () => {
    expect(formatBytes(1048576)).toBe("1.00 MB");
    expect(formatBytes(52428800)).toBe("50.0 MB");
  });

  it("formats gigabytes and terabytes", () => {
    expect(formatBytes(1073741824)).toBe("1.00 GB");
    expect(formatBytes(1099511627776)).toBe("1.00 TB");
  });
});

describe("formatExactBytes", () => {
  it("formats exact bytes with comma separation", () => {
    expect(formatExactBytes(1024)).toBe("1,024 bytes");
    expect(formatExactBytes(1000000)).toBe("1,000,000 bytes");
  });
});

describe("formatModified", () => {
  it("formats ISO string into human readable date", () => {
    const res = formatModified("2026-09-25T10:00:00Z");
    expect(res).toBeTruthy();
    expect(res).not.toBe("Invalid Date");
  });

  it("returns fallback for invalid string", () => {
    expect(formatModified("invalid-date")).toBe("invalid-date");
  });
});

describe("formatRelativeTime", () => {
  it("formats very recent timestamps as Just now", () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe("Just now");
  });

  it("formats minutes ago", () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(formatRelativeTime(tenMinutesAgo)).toBe("10m ago");
  });

  it("formats hours ago", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe("2h ago");
  });

  it("formats days ago", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeDaysAgo)).toBe("3d ago");
  });
});
