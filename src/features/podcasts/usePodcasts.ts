import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchInfiniteTrending,
  fetchSearchResults,
} from "../../api/podcastApi";
import { loadFavorites, addToFavorites, removeFromFavorites, isFavorite as checkIsFavorite } from "../favorites/favoritesUtils";
import type { ApiPodcast, Podcast } from "../../types";

type TabType = "trending" | "favorites" | "search";

export function usePodcasts() {
  const [activeTab, setActiveTab] = useState<TabType>("trending");
  const [favorites, setFavorites] = useState<Podcast[]>([]);
  const [displayCount, setDisplayCount] = useState(20);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [searchResults, setSearchResults] = useState<ApiPodcast[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<ApiPodcast[], Error>({
    queryKey: ["trendingPodcasts"],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        return await fetchInfiniteTrending(pageParam as number, 40);
      } catch (err) {
        throw err instanceof Error ? err : new Error("Error fetching podcasts");
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 40) return undefined;
      return allPages.flat().length;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    initialPageParam: 0,
    retry: false,
  });

  useEffect(() => {
    const trimmedQuery = debouncedSearchQuery.trim();

    if (trimmedQuery === "") {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setSearchResults(null);
    setIsSearching(true);

    const doSearch = async () => {
      try {
        const results = await fetchSearchResults(trimmedQuery);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    doSearch();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (searchQuery.trim() !== "" && activeTab !== "search") {
      setActiveTab("search");
    } else if (searchQuery.trim() === "" && activeTab === "search") {
      setActiveTab("trending");
    }
  }, [searchQuery, activeTab]);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const allPodcasts: ApiPodcast[] = data?.pages.flat() || [];

  const podcastsWithStatus = allPodcasts.map((p) => ({
    ...p,
    isFavorite: checkIsFavorite(p.id),
  }));

  const displayedPodcasts = (() => {
    if (activeTab === "search") {
      if (isSearching) {
        return [];
      }
      return searchResults?.map((p) => ({
        ...p,
        isFavorite: checkIsFavorite(p.id),
      })) || [];
    } else if (activeTab === "trending") {
      return podcastsWithStatus.slice(0, displayCount);
    } else {
      return favorites;
    }
  })();

  useEffect(() => {
    if (activeTab !== "trending") return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (displayCount < podcastsWithStatus.length) {
          setDisplayCount((prev) =>
            Math.min(prev + 20, podcastsWithStatus.length)
          );
        } else if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [
    activeTab,
    displayCount,
    podcastsWithStatus.length,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  const toggleFavorite = (id: string) => {
    const podcastId = parseInt(id);
    const source = [
      ...(searchResults || []),
      ...allPodcasts,
      ...favorites,
    ];
    const podcast = source.find((p) => p.id === podcastId);

    if (!podcast) return;

    if (checkIsFavorite(podcastId)) {
      const newFavorites = removeFromFavorites(podcastId);
      setFavorites(newFavorites);
    } else {
      const podcastWithFavorite: Podcast = { ...podcast, isFavorite: true };
      const newFavorites = addToFavorites(podcastWithFavorite);
      setFavorites(newFavorites);
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (activeTab === tab) return;

    setSearchQuery("");
    setSearchResults(null);
    setActiveTab(tab);

    if (tab === "trending") {
      setDisplayCount(20);
    }
  };

  return {
    activeTab,
    handleTabChange,
    favorites,
    toggleFavorite,
    displayedPodcasts,
    isSearching,
    isLoading,
    isError,
    error,
    loadMoreRef,
    isFetchingNextPage,
    searchQuery,
    setSearchQuery,
    favoritesCount: favorites.length,
    searchResults,
  };
}
