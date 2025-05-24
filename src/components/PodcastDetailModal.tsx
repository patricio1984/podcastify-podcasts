import { useEffect, useRef, useState, useCallback } from "react";
import type { Episode } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "../assets/icons/CloseIcon";
import PlayIcon from "../assets/icons/PlayIcon";
import PauseIcon from "../assets/icons/PauseIcon";
import StarIcon from "../assets/icons/StarIcon";
import EmptyStarIcon from "../assets/icons/EmptyStarIcon";
import { fetchEpisodesByFeedId } from "../api/podcastApi";
import { useModal } from "../features/playback/ModalContext";
import { usePlaybackContext } from "../features/playback/PlaybackContext";
import useMediaQuery from "../hooks/useMediaQuery";
import PodcastDetailModalSkeleton from "./skeletons/PodcastDetailModalSkeleton";
import { isFavorite as checkIsFavorite } from "../features/favorites/favoritesUtils";
import { getSecureImageUrl } from "../utils/imageUtils";

/**
 * Modal principal de detalles del podcast.
 * Implementa scroll infinito, UI adaptativa y gestos móviles.
 * La UI se comprime/expande basada en la posición del scroll.
 */

interface PodcastDetailModalProps {
  feedId: number;
  podcastTitle: string;
  podcastImage: string;
  podcastDescription: string;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
  onClose: () => void;
}

const PodcastDetailModal = ({
  feedId,
  podcastTitle,
  podcastImage,
  podcastDescription,
  toggleFavorite,
  onClose,
}: PodcastDetailModalProps) => {
  const { openModal } = useModal();
  const { currentEpisode, duration, currentTime, isPlaying, play, pause } =
    usePlaybackContext();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestTimestamp, setOldestTimestamp] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState<number | null>(null);
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [localIsFavorite, setLocalIsFavorite] = useState(() =>
    checkIsFavorite(feedId)
  );

  useEffect(() => {
    setLocalIsFavorite(checkIsFavorite(feedId));
  }, [feedId]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(String(feedId));
    setLocalIsFavorite(!localIsFavorite);
  };

  const modalBaseClasses = isMobile
    ? "fixed inset-0 top-[70px] z-50 w-full h-[calc(100vh-70px)] bg-[#0F0F2DCC] backdrop-blur-[15px] rounded-t-[39px] flex flex-col items-center justify-start overflow-hidden p-6"
    : "fixed left-0 top-0 z-50 h-full w-[445px] rounded-r-[39px] bg-brand backdrop-blur-[15px] p-6 pt-15 flex flex-col items-center justify-start overflow-hidden";

  const buttonCloseClasses = `
    absolute top-8 right-9 text-white hover:text-gray-300 text-xl cursor-pointer
  `;

  const mobileVariants = {
    initial: { y: "100%", x: 0 },
    animate: { y: 0, x: 0 },
    exit: { y: "100%", x: 0 },
  };

  const desktopVariants = {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  };

  interface DragInfo {
    offset: {
      x: number;
      y: number;
    };
    point: {
      x: number;
      y: number;
    };
  }

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: DragInfo
  ) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  const handleDragHandleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClose();
    }
  };

  const loadMoreEpisodes = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);

      const {
        episodes: newEpisodes,
        oldestTimestamp: newTimestamp,
        count,
      } = await fetchEpisodesByFeedId(
        feedId,
        oldestTimestamp ? oldestTimestamp - 1 : undefined,
        oldestTimestamp ? 100 : 1000
      );

      if (newEpisodes.length === 0) {
        setHasMore(false);
        return;
      }

      if (totalEpisodes === null) {
        setTotalEpisodes(count);
      }

      setEpisodes((prev) => {
        const existingIds = new Set(prev.map((ep) => ep.id));
        const uniqueNewEpisodes = newEpisodes.filter(
          (ep) => !existingIds.has(ep.id)
        );

        if (uniqueNewEpisodes.length === 0) {
          setHasMore(false);
          return prev;
        }

        return [
          ...prev,
          ...uniqueNewEpisodes.map((ep) => ({
            id: ep.id,
            title: ep.title,
            enclosureUrl: ep.enclosureUrl,
            podcastTitle,
            image: podcastImage,
            duration: ep.duration,
          })),
        ];
      });

      setOldestTimestamp(newTimestamp);
    } catch (error) {
      console.error("Error loading more episodes:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    feedId,
    isLoading,
    hasMore,
    oldestTimestamp,
    podcastTitle,
    podcastImage,
    totalEpisodes,
  ]);

  /**
   * Configura el observer para carga infinita con un debounce de 300ms
   */
  useEffect(() => {
    if (!hasMore) return;

    const options = {
      root: scrollableContentRef.current,
      rootMargin: "100px",
      threshold: 0.1,
    };

    let timeoutId: number;
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          loadMoreEpisodes();
        }, 300);
      }
    }, options);

    const sentinel = document.getElementById("episode-list-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [loadMoreEpisodes, hasMore, isLoading]);

  useEffect(() => {
    loadMoreEpisodes();
    return () => {
      setEpisodes([]);
      setHasMore(true);
      setOldestTimestamp(null);
      setTotalEpisodes(null);
    };
  }, [feedId]);

  useEffect(() => {
    scrollableContentRef.current?.scrollTo({ top: 0 });
  }, [feedId]);

  /**
   * Maneja la UI adaptativa: comprime header al scrollear
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = scrollableContentRef.current;
      if (scrollContainer) {
        const newScrolled = scrollContainer.scrollTop > 20;
        setScrolled((prev) => (prev !== newScrolled ? newScrolled : prev));
      }
    };

    const ref = scrollableContentRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Previene el scroll del body en mobile cuando el modal está abierto
   */
  useEffect(() => {
    if (isMobile) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isMobile]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDuration = (durationInSeconds?: number) => {
    if (!durationInSeconds) return "Duración no disponible";
    const minutes = Math.round(durationInSeconds / 60);
    return `${minutes} min`;
  };

  const handleEpisodePlayPause = async (episode: Episode) => {
    if (currentEpisode?.enclosureUrl === episode.enclosureUrl) {
      if (isPlaying) {
        pause();
        return;
      } else {
        await play(episode);
      }
    } else {
      await play(episode);
    }

    openModal({
      type: "playback",
      episode: {
        id: episode.id,
        title: episode.title,
        enclosureUrl: episode.enclosureUrl,
        podcastTitle: episode.podcastTitle,
        image: episode.image,
      },
    });
  };

  const isCurrentEpisode = (episode: Episode) => {
    return currentEpisode?.enclosureUrl === episode.enclosureUrl;
  };

  const getEpisodeDisplayTime = (episode: Episode) => {
    if (isCurrentEpisode(episode)) {
      return `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
    return formatDuration(episode.duration);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        className={modalBaseClasses}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={isMobile ? mobileVariants : desktopVariants}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        drag={isMobile ? "y" : false}
        dragConstraints={isMobile ? { top: 0, bottom: 0 } : undefined}
        dragElastic={isMobile ? 0.2 : undefined}
        onDragEnd={isMobile ? handleDragEnd : undefined}
      >
        {isMobile && (
          <>
            <button
              className="w-full flex justify-center mb-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
              onClick={onClose}
              onKeyDown={handleDragHandleKeyDown}
              aria-label="Deslizar hacia abajo o presionar para cerrar"
            >
              <div className="w-14 h-[3px] bg-white rounded-full" />
            </button>

            <button
              onClick={handleToggleFavorite}
              className="absolute top-8 left-9 text-white hover:text-brand transition cursor-pointer"
              aria-label={
                localIsFavorite ? "Remover de favoritos" : "Agregar a favoritos"
              }
            >
              {localIsFavorite ? (
                <StarIcon className="h-6 w-6" />
              ) : (
                <EmptyStarIcon className="h-6 w-6" />
              )}
            </button>
          </>
        )}

        <button
          className={buttonCloseClasses}
          onClick={onClose}
          aria-label="Cerrar detalles del podcast"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col items-center w-full h-full pt-4 sm:pt-0">
          <div
            className={`w-full flex flex-col items-center transition-all duration-300 ease-out ${
              scrolled ? "pb-3 pt-3" : "pb-4 pt-4"
            }`}
          >
            <div className="relative w-full flex justify-center">
              {podcastImage && (
                <img
                  src={getSecureImageUrl(podcastImage)}
                  alt={`Imagen del podcast ${podcastTitle}`}
                  className={`rounded-[20px] object-cover flex-shrink-0 transition-all duration-300 ease-out ${
                    scrolled
                      ? "w-[60px] h-[60px] sm:w-[76px] sm:h-[76px]"
                      : "w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"
                  }`}
                  loading="lazy"
                />
              )}
            </div>

            <h2 className="text-white font-bold text-center px-4 mt-2 sm:mt-7 transition-all duration-300 ease-out text-[26px]">
              {podcastTitle}
            </h2>
          </div>

          <div
            ref={scrollableContentRef}
            className="flex flex-col w-full overflow-y-auto flex-1 min-h-0"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            <div
              className={`w-full px-4 mb-4 transition-all duration-300 ease-out ${
                scrolled
                  ? "opacity-0 max-h-0 mb-0 pb-0 overflow-hidden"
                  : "opacity-100 max-h-none mb-4 pb-4"
              }`}
            >
              <div className="relative">
                <p className="font-Ubuntu text-base text-center text-white line-clamp-3 leading-relaxed">
                  {podcastDescription}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none" />
              </div>
            </div>

            <div className="w-full px-4 pb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-Ubuntu text-xl font-bold text-white">
                  {totalEpisodes !== null
                    ? `${totalEpisodes} episodios`
                    : "Episodios"}
                </h3>
              </div>

              {episodes.length === 0 && isLoading ? (
                <PodcastDetailModalSkeleton />
              ) : episodes.length === 0 ? (
                <p className="text-center text-white">
                  No se encontraron episodios para este podcast.
                </p>
              ) : (
                <>
                  <ul className="space-y-0">
                    {episodes.map((episode, index) => (
                      <li
                        key={episode.id}
                        className={`flex gap-3 items-center justify-between p-3 transition-all duration-200 border-b border-white/30 hover:border-white/50 cursor-pointer ${
                          isCurrentEpisode(episode)
                            ? "bg-white/20 border-white/30"
                            : "hover:bg-white/5"
                        } ${index === episodes.length - 1 ? "border-b-0" : ""}`}
                        onClick={() => handleEpisodePlayPause(episode)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleEpisodePlayPause(episode);
                          }
                        }}
                        aria-label={`${episode.title}. ${
                          isCurrentEpisode(episode)
                            ? isPlaying
                              ? "Reproduciendo"
                              : "Pausado"
                            : "Click para reproducir"
                        }`}
                      >
                        <img
                          src={getSecureImageUrl(episode.image)}
                          alt={`Imagen del episodio ${episode.title}`}
                          className="rounded-lg h-[40px] w-[40px] object-cover"
                          loading="lazy"
                        />
                        <div className="flex flex-col flex-grow mr-2 overflow-hidden">
                          <span className="text-base text-white font-bold truncate">
                            {episode.title}
                          </span>
                          <span className="font-Ubuntu text-sm text-white">
                            {getEpisodeDisplayTime(episode)}
                          </span>
                          {isCurrentEpisode(episode) && (
                            <span
                              className="text-xs text-green-400 font-medium"
                              role="status"
                            >
                              {isPlaying ? "Reproduciendo..." : "Pausado"}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEpisodePlayPause(episode);
                          }}
                          className="bg-white h-[40px] w-[40px] grid place-items-center flex-shrink-0 text-brand text-xl rounded-full hover:bg-gray-200 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                          aria-label={
                            isCurrentEpisode(episode) && isPlaying
                              ? `Pausar episodio ${episode.title}`
                              : `Reproducir episodio ${episode.title}`
                          }
                        >
                          {isCurrentEpisode(episode) && isPlaying ? (
                            <PauseIcon width={10} height={12} />
                          ) : (
                            <PlayIcon
                              width={12}
                              height={14}
                              className="relative left-0.5"
                            />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {hasMore && (
                    <div
                      id="episode-list-sentinel"
                      className="py-4 text-center h-20"
                    >
                      {isLoading && (
                        <div className="text-sm text-white">
                          Cargando más episodios...
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PodcastDetailModal;
