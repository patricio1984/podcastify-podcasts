import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../test/test-utils";
import PodcastGrid from "../PodcastGrid";
import type { Podcast } from "../../types";

vi.mock("../PodcastCard", () => ({
  default: ({ podcast }: { podcast: Podcast }) => (
    <article data-testid="podcast-card">
      <h3>{podcast.title}</h3>
    </article>
  ),
}));

describe("PodcastGrid", () => {
  const mockPodcasts: Podcast[] = [
    {
      id: 1,
      title: "Podcast 1",
      description: "Description 1",
      image: "image1.jpg",
      isFavorite: false,
      url: "url1",
      originalUrl: "original-url1",
      link: "link1",
      language: "es",
      author: "Author 1",
      artwork: "artwork1",
      lastUpdateTime: 123456789,
      lastCrawlTime: 123456789,
      lastParseTime: 123456789,
      lastGoodHttpStatusTime: 123456789,
      contentType: "audio/mpeg",
      episodeCount: 5,
    },
    {
      id: 2,
      title: "Podcast 2",
      description: "Description 2",
      image: "image2.jpg",
      isFavorite: true,
      url: "url2",
      originalUrl: "original-url2",
      link: "link2",
      language: "es",
      author: "Author 2",
      artwork: "artwork2",
      lastUpdateTime: 123456789,
      lastCrawlTime: 123456789,
      lastParseTime: 123456789,
      lastGoodHttpStatusTime: 123456789,
      contentType: "audio/mpeg",
      episodeCount: 3,
    },
  ];

  const mockToggleFavorite = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all podcasts", () => {
    render(
      <PodcastGrid
        podcasts={mockPodcasts}
        toggleFavorite={mockToggleFavorite}
      />
    );

    const cards = screen.getAllByTestId("podcast-card");
    expect(cards).toHaveLength(mockPodcasts.length);
    expect(screen.getByText("Podcast 1")).toBeInTheDocument();
    expect(screen.getByText("Podcast 2")).toBeInTheDocument();
  });

  it("returns null when no podcasts provided", () => {
    const { container } = render(
      <PodcastGrid podcasts={[]} toggleFavorite={mockToggleFavorite} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("applies correct grid layout classes", () => {
    const { container } = render(
      <PodcastGrid
        podcasts={mockPodcasts}
        toggleFavorite={mockToggleFavorite}
      />
    );

    const grid = container.firstChild;
    expect(grid).toHaveClass("grid");
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("sm:grid-cols-2");
    expect(grid).toHaveClass("md:grid-cols-3");
    expect(grid).toHaveClass("lg:grid-cols-4");
  });
});
