import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders root view without up button", () => {
    const onNavigate = vi.fn();
    render(<Breadcrumbs path="/" onNavigate={onNavigate} />);

    expect(screen.getByText("Root")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /go up/i })).not.toBeInTheDocument();
  });

  it("renders nested directory segments and handles navigation", () => {
    const onNavigate = vi.fn();
    render(<Breadcrumbs path="/Movies/Action" onNavigate={onNavigate} />);

    expect(screen.getByText("Root")).toBeInTheDocument();
    expect(screen.getByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();

    // Click on Movies segment
    fireEvent.click(screen.getByText("Movies"));
    expect(onNavigate).toHaveBeenCalledWith("/Movies");

    // Click on Root
    fireEvent.click(screen.getByText("Root"));
    expect(onNavigate).toHaveBeenCalledWith("/");

    // Click on go up button (should navigate to parent /Movies)
    const upButton = screen.getByRole("button", { name: /go up/i });
    fireEvent.click(upButton);
    expect(onNavigate).toHaveBeenCalledWith("/Movies");
  });
});
