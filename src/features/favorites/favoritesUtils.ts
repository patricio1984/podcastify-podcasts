import { Podcast } from "../../types";

const FAVORITES_KEY = "favorites";

export function loadFavorites(): Podcast[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error loading favorites:", err);
    return [];
  }
}

export function saveFavorites(favorites: Podcast[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error("Error saving favorites:", err);
  }
}

export function addToFavorites(podcast: Podcast): Podcast[] {
  try {
    const currentFavorites = loadFavorites();
    if (!currentFavorites.some((p) => p.id === podcast.id)) {
      const newFavorites = [
        ...currentFavorites,
        { ...podcast, isFavorite: true },
      ];
      saveFavorites(newFavorites);
      return newFavorites;
    }
    return currentFavorites;
  } catch (err) {
    console.error("Error adding to favorites:", err);
    return loadFavorites();
  }
}

export function removeFromFavorites(podcastId: number): Podcast[] {
  try {
    const currentFavorites = loadFavorites();
    const newFavorites = currentFavorites.filter((p) => p.id !== podcastId);
    saveFavorites(newFavorites);
    return newFavorites;
  } catch (err) {
    console.error("Error removing from favorites:", err);
    return loadFavorites();
  }
}

export function isFavorite(podcastId: number): boolean {
  try {
    const currentFavorites = loadFavorites();
    return currentFavorites.some((p) => p.id === podcastId);
  } catch (err) {
    console.error("Error checking favorite status:", err);
    return false;
  }
}
