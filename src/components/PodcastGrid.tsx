import PodcastCard from "./PodcastCard";
import { Podcast } from "../types";

type PodcastGridProps = {
  podcasts: Podcast[];
  toggleFavorite: (id: string) => void;
};

export default function PodcastGrid({
  podcasts,
  toggleFavorite,
}: PodcastGridProps) {
  if (podcasts.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Listado de podcasts"
      className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 md:gap-8"
    >
      {podcasts.map((podcast, index) => (
        <PodcastCard
          key={`${podcast.id}-${index}`}
          podcast={podcast}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </section>
  );
}
