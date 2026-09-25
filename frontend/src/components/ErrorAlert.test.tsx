import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorAlert } from "./ErrorAlert";

describe("ErrorAlert", () => {
  it("renders error message and retry button", () => {
    const onRetry = vi.fn();
    render(<ErrorAlert message="Failed to load" onRetry={onRetry} />);

    expect(screen.getByText("Failed to load")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders go to root button when onGoBack is provided", () => {
    const onGoBack = vi.fn();
    render(
      <ErrorAlert
        message="Directory not found"
        onRetry={vi.fn()}
        onGoBack={onGoBack}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /go to root/i }));
    expect(onGoBack).toHaveBeenCalledTimes(1);
  });
});
