import { useEffect, useState } from "react";
import useMediaQuery from "../hooks/useMediaQuery";
import { Podcast } from "../types";
import EmptyStarIcon from "../assets/icons/EmptyStarIcon";
import { useModal } from "../features/playback/ModalContext";
import StarIcon from "../assets/icons/StarIcon";
import PersonIcon from "../assets/icons/PersonIcon";
import ChevronRightIcon from "../assets/icons/ChevronRightIcon";
import { fetchEpisodesByFeedId } from "../api/podcastApi";
import { getSecureImageUrl } from "../utils/imageUtils";

type PodcastCardProps = {
  podcast: Podcast;
  toggleFavorite: (id: string) => void;
};

function stripHtml(htmlString: string): string {
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
}

export default function PodcastCard({
  podcast,
  toggleFavorite,
}: PodcastCardProps) {
  const { openModal } = useModal();
  const cleanedDescription = stripHtml(podcast.description);
  const imageToPass = getSecureImageUrl(podcast.image);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [episodeCount, setEpisodeCount] = useState<number | null>(null);

  useEffect(() => {
    if (isMobile) {
      fetchEpisodesByFeedId(podcast.id, undefined, 1000)
        .then((data) => {
          setEpisodeCount(data.episodes.length);
        })
        .catch((err) => {
          console.error("Error al obtener episodios en mobile:", err);
          setEpisodeCount(podcast.episodeCount || 0);
        });
    } else {
      setEpisodeCount(null);
    }
  }, [isMobile, podcast.id, podcast.episodeCount]);

  const handleCardClick = () => {
    openModal({
      type: "detail",
      feedId: podcast.id,
      podcastTitle: podcast.title,
      podcastImage: imageToPass,
      podcastDescription: cleanedDescription,
      isFavorite: podcast.isFavorite,
      toggleFavorite,
    });
  };

  return (
    <article
      className="group relative flex md:block h-auto md:h-[344px] rounded-2xl overflow-hidden cursor-pointer transition-shadow hover:shadow-xl"
      tabIndex={0}
      aria-label={`${podcast.title} por ${podcast.author}`}
      onClick={handleCardClick}
    >
      <img
        src={imageToPass}
        alt={`Imagen de ${podcast.title}`}
        className="w-21 h-21 rounded-xl object-cover flex-shrink-0 self-center md:absolute md:inset-0 md:w-full md:h-full md:rounded-none md:object-cover md:z-0 group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />

      <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-0" />

      <button
        aria-label={
          podcast.isFavorite ? "Remover de favoritos" : "Agregar a favoritos"
        }
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(String(podcast.id));
        }}
        className="absolute top-2 right-2 md:top-3 md:right-3 z-10 text-white hover:text-brand transition cursor-pointer"
      >
        {podcast.isFavorite ? (
          <StarIcon className="h-6 w-6 md:h-7 md:w-7" />
        ) : (
          <EmptyStarIcon className="h-6 w-6 md:h-7 md:w-7" />
        )}
      </button>

      <div className="flex flex-col justify-center px-3 py-2 md:absolute md:bottom-0 md:left-0 md:right-0 md:p-4 md:z-10 text-black md:text-white flex-1 min-w-0 self-center">
        <h2 className="text-xl md:text-lg font-black truncate md:mb-1">
          {podcast.title}
        </h2>
        <p className="font-Ubuntu text-[15px] md:text-sm md:font-bold text-black md:text-white line-clamp-2 md:line-clamp-3 md:mb-3">
          {cleanedDescription}
        </p>

        <p className="hidden leading-[1.3] md:leading-[1.5] md:flex text-xs font-bold items-center text-white">
          <PersonIcon className="mr-1" />
          por <span className="ml-1 line-clamp-1">{podcast.author}</span>
        </p>

        <span className="font-Ubuntu font-medium text-xs md:hidden mt-1">
          {episodeCount !== null ? episodeCount : podcast.episodeCount || 0}{" "}
          episodios
        </span>
      </div>

      <ChevronRightIcon className="md:hidden w-5 h-5 text-gray-400 self-center" />
    </article>
  );
}
