import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../test/test-utils";
import TogglePills from "../TogglePills";

describe("TogglePills", () => {
  const defaultProps = {
    activeTab: "trending" as const,
    setActiveTab: vi.fn(),
    favoritesCount: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all tabs", () => {
    render(<TogglePills {...defaultProps} />);

    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("Favoritos")).toBeInTheDocument();
  });

  it("shows correct active styles for trending tab", () => {
    render(<TogglePills {...defaultProps} />);

    const trendingButton = screen.getByText("Trending").closest("button");
    expect(trendingButton).toHaveClass("bg-brand");
    expect(trendingButton).toHaveClass("text-white");
  });

  it("shows correct inactive styles for favorites tab", () => {
    render(<TogglePills {...defaultProps} />);

    const favoritesButton = screen.getByText("Favoritos").closest("button");
    expect(favoritesButton).toHaveClass("bg-white");
    expect(favoritesButton).toHaveClass("text-brand");
  });

  it("calls setActiveTab when clicking a tab", async () => {
    const { user } = render(<TogglePills {...defaultProps} />);

    const favoritesButton = screen.getByText("Favoritos").closest("button");
    await user.click(favoritesButton!);

    expect(defaultProps.setActiveTab).toHaveBeenCalledWith("favorites");
  });

  it("displays favorites count", () => {
    render(<TogglePills {...defaultProps} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows correct active styles when favorites is active", () => {
    render(<TogglePills {...defaultProps} activeTab="favorites" />);

    const favoritesButton = screen.getByText("Favoritos").closest("button");
    expect(favoritesButton).toHaveClass("bg-brand");
    expect(favoritesButton).toHaveClass("text-white");
  });
});
