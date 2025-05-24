import { describe, it, expect, beforeEach } from "vitest";
import {
  loadFavorites,
  saveFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from "../favoritesUtils";
import { Podcast } from "../../../types";

describe("favoritesUtils", () => {
  const mockPodcast: Podcast = {
    id: 1,
    title: "Test Podcast",
    description: "Test Description",
    url: "http://test.com/feed",
    originalUrl: "http://test.com/original",
    link: "http://test.com",
    language: "en",
    author: "Test Author",
    artwork: "http://test.com/artwork.jpg",
    lastUpdateTime: Date.now(),
    lastCrawlTime: Date.now(),
    lastParseTime: Date.now(),
    lastGoodHttpStatusTime: Date.now(),
    contentType: "audio/mpeg",
    isFavorite: false,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("should load empty favorites when storage is empty", () => {
    const favorites = loadFavorites();
    expect(favorites).toEqual([]);
  });

  it("should save and load favorites correctly", () => {
    const favorites = [mockPodcast];
    saveFavorites(favorites);
    const loaded = loadFavorites();
    expect(loaded).toEqual(favorites);
  });

  it("should add a podcast to favorites", () => {
    const updatedFavorites = addToFavorites(mockPodcast);
    expect(updatedFavorites).toHaveLength(1);
    expect(updatedFavorites[0]).toEqual({ ...mockPodcast, isFavorite: true });

    const storedFavorites = loadFavorites();
    expect(storedFavorites).toHaveLength(1);
    expect(storedFavorites[0]).toEqual({ ...mockPodcast, isFavorite: true });
  });

  it("should not add duplicate podcasts to favorites", () => {
    addToFavorites(mockPodcast);
    const updatedFavorites = addToFavorites(mockPodcast);
    expect(updatedFavorites).toHaveLength(1);
  });

  it("should remove a podcast from favorites", () => {
    addToFavorites(mockPodcast);
    const updatedFavorites = removeFromFavorites(mockPodcast.id);
    expect(updatedFavorites).toHaveLength(0);

    const storedFavorites = loadFavorites();
    expect(storedFavorites).toHaveLength(0);
  });

  it("should check if a podcast is in favorites", () => {
    expect(isFavorite(mockPodcast.id)).toBe(false);
    addToFavorites(mockPodcast);
    expect(isFavorite(mockPodcast.id)).toBe(true);
  });

  it("should handle localStorage errors gracefully", () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error("Storage error");
    };

    expect(() => saveFavorites([mockPodcast])).not.toThrow();
    expect(loadFavorites()).toEqual([]);

    localStorage.setItem = originalSetItem;
  });
});
