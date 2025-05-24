export interface ApiPodcast {
  id: number;
  title: string;
  description: string;
  url: string;
  originalUrl: string;
  link: string;
  language: string;
  author: string;
  artwork: string;
  lastUpdateTime: number;
  lastCrawlTime: number;
  lastParseTime: number;
  lastGoodHttpStatusTime: number;
  contentType: string;
  itunesId?: number;
  newestItemPublishTime?: number;
  oldestItemPublishTime?: number;
  image?: string;
  episodeCount?: number;
  categories?: Record<string, string>;
}

export interface Podcast extends ApiPodcast {
  isFavorite: boolean;
}

export interface IconProps {
  className?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
  "aria-label"?: string;
  width?: string | number;
  height?: string | number;
}

export interface Episode {
  id: number;
  title: string;
  enclosureUrl: string;
  podcastTitle: string;
  image: string;
  duration?: number;
}

export interface ApiEpisode {
  id: number;
  title: string;
  link: string;
  description: string;
  guid: string;
  datePublished: number;
  datePublishedPretty: string;
  dateCrawled: number;
  enclosureUrl: string;
  enclosureType: string;
  enclosureLength: number;
  duration: number;
  explicit: number;
  episode: number;
  episodeType: string;
  season: number;
  image: string;
  feedItunesId: number;
  feedImage: string;
  feedId: number;
  feedLanguage: string;
  chaptersUrl: string;
  transcriptUrl: string;
}
