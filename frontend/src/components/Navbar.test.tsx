import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders brand and handles home click", () => {
    const onHome = vi.fn();
    render(<Navbar onNavigateHome={onHome} />);

    expect(screen.getByText("Suchi")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Suchi"));
    expect(onHome).toHaveBeenCalled();
  });

  it("renders theme toggle button", () => {
    render(<Navbar onNavigateHome={vi.fn()} />);
    const toggleBtn = screen.getByRole("button", { name: /toggle theme/i });
    expect(toggleBtn).toBeInTheDocument();
  });
});
