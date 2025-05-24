import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PodcastDetailModalSkeleton from "../skeletons/PodcastDetailModalSkeleton";

describe("PodcastDetailModalSkeleton", () => {
  it("renders skeleton elements", () => {
    render(<PodcastDetailModalSkeleton />);
    const skeletonItems = screen.getAllByTestId("podcast-card");
    expect(skeletonItems).toHaveLength(5);
  });

  it("applies animation classes", () => {
    const { container } = render(<PodcastDetailModalSkeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
    expect(container.firstChild).toHaveClass("space-y-0");
  });

  it("renders skeleton items with correct structure", () => {
    render(<PodcastDetailModalSkeleton />);
    const items = screen.getAllByTestId("podcast-card");
    items.forEach((item) => {
      expect(item).toHaveClass(
        "flex",
        "gap-3",
        "items-center",
        "justify-between",
        "p-3"
      );
      expect(item.querySelector(".rounded-lg")).toBeInTheDocument();
      expect(item.querySelector(".flex-grow")).toBeInTheDocument();
    });
  });

  it("applies correct spacing and border classes", () => {
    render(<PodcastDetailModalSkeleton />);
    const items = screen.getAllByTestId("podcast-card");
    items.forEach((item, index) => {
      expect(item).toHaveClass("border-b", "border-white/30");
      if (index === items.length - 1) {
        expect(item).toHaveClass("border-b-0");
      }
    });
  });

  it("has correct container padding", () => {
    const { container } = render(<PodcastDetailModalSkeleton />);
    expect(container.firstChild).toHaveClass("px-4");
    expect(container.firstChild).toHaveClass("pb-6");
  });
});
