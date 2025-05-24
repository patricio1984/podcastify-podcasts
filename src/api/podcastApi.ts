import CryptoJS from "crypto-js";
import { ApiPodcast, ApiEpisode } from "../types";

const BASE_URL = "https://api.podcastindex.org/api/1.0";

interface FeedsResponse {
  feeds: ApiPodcast[];
}

interface EpisodesResponse {
  items: ApiEpisode[];
  count: number;
  description: string;
  status: string;
}

const generateAuthHeaders = (): Record<string, string> => {
  const apiKey = import.meta.env.VITE_PODCAST_INDEX_API_KEY?.trim();
  const apiSecret = import.meta.env.VITE_PODCAST_INDEX_API_SECRET?.trim();

  if (!apiKey || !apiSecret) {
    throw new Error(
      "API Key o Secret no definidos. Asegúrate de que las variables de entorno VITE_PODCAST_INDEX_API_KEY y VITE_PODCAST_INDEX_API_SECRET estén configuradas."
    );
  }

  const unixTime = Math.floor(Date.now() / 1000);
  const hash = CryptoJS.SHA1(apiKey + apiSecret + unixTime)
    .toString(CryptoJS.enc.Hex)
    .toLowerCase();

  return {
    "User-Agent": "MyPodcastApp/1.0",
    "X-Auth-Date": unixTime.toString(),
    "X-Auth-Key": apiKey,
    Authorization: hash,
  };
};

async function podcastIndexFetch<T>(
  endpoint: string,
  errorMessage: string
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = generateAuthHeaders();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const contentType = response.headers.get("Content-Type");
      let errorDetail = "";

      if (contentType?.includes("application/json")) {
        const errorJson = await response.json();
        errorDetail = errorJson.description || JSON.stringify(errorJson);
      } else {
        errorDetail = await response.text();
      }

      throw new Error(`${errorMessage}: ${errorDetail || response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`${errorMessage}: ${String(err)}`);
  }
}

export const fetchInfiniteTrending = async (
  since: number = 0,
  max: number = 40
): Promise<ApiPodcast[]> => {
  try {
    const data = await podcastIndexFetch<FeedsResponse>(
      `/podcasts/trending?max=${max}&since=${since}`,
      "Error al obtener podcasts trending"
    );
    return data.feeds || [];
  } catch (err) {
    throw err instanceof Error
      ? err
      : new Error("Error fetching trending podcasts");
  }
};

export const fetchSearchResults = async (
  query: string
): Promise<ApiPodcast[]> => {
  const data = await podcastIndexFetch<FeedsResponse>(
    `/search/byterm?q=${encodeURIComponent(query)}`,
    "Error al buscar podcasts"
  );
  return data.feeds || [];
};

export async function fetchEpisodesByFeedId(
  feedId: number,
  since?: number,
  max: number = 100
): Promise<{
  episodes: ApiEpisode[];
  oldestTimestamp: number | null;
  count: number;
}> {
  const data = await podcastIndexFetch<EpisodesResponse>(
    `/episodes/byfeedid?id=${feedId}&max=${max}${
      since ? `&since=${since}` : ""
    }`,
    "Error al obtener episodios por Feed ID"
  );

  const episodes = data.items || [];
  const oldestTimestamp =
    episodes.length > 0
      ? Math.min(...episodes.map((ep) => ep.datePublished))
      : null;

  const uniqueEpisodes = Array.from(
    new Map(episodes.map((episode) => [episode.id, episode])).values()
  );

  return {
    episodes: uniqueEpisodes,
    oldestTimestamp,
    count: data.count || episodes.length,
  };
}
