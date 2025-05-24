import { useState, useRef } from "react";
import { Episode } from "../../types";
import { usePlaybackContext } from "./PlaybackContext";
import CloseIcon from "../../assets/icons/CloseIcon";
import PauseIcon from "../../assets/icons/PauseIcon";
import PlayIcon from "../../assets/icons/PlayIcon";
import { motion, AnimatePresence } from "framer-motion";
import useMediaQuery from "../../hooks/useMediaQuery";
import { getSecureImageUrl } from "../../utils/imageUtils";

interface PlaybackModalProps {
  episode: Episode;
  onClose: () => void;
}

/**
 * Modal de reproducción con diseño adaptativo y controles de arrastre.
 * Maneja la reproducción de episodios y su estado, con diferentes layouts para mobile/desktop.
 * En desktop permite arrastrar el modal a cualquier posición de la pantalla.
 */

function PlaybackModal({ episode, onClose }: PlaybackModalProps) {
  const {
    currentEpisode,
    isPlaying,
    play,
    pause,
    stop,
    duration,
    currentTime,
    seekTo,
  } = usePlaybackContext();

  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (currentEpisode?.enclosureUrl === episode.enclosureUrl) {
      if (isPlaying) {
        pause();
      } else {
        play(episode);
      }
    } else {
      play(episode);
    }
  };

  const handleClose = () => {
    stop();
    onClose();
  };

  const modalBaseClasses = `
    fixed bottom-0 z-[60] bg-brand text-white overflow-hidden pointer-events-auto
    flex flex-col items-center justify-center
    w-full h-[115px] rounded-none p-6
    sm:bg-[#0F0F2DCC] sm:backdrop-blur-[15px] sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[440px] sm:rounded-[39px] sm:p-6 sm:pt-15 sm:flex-col sm:shadow-xl
  `;

  const buttonCloseClasses =
    "absolute cursor-pointer top-8 left-9 text-white hover:text-gray-300 text-xl hidden sm:block";

  const mobileVariants = {
    hidden: { opacity: 0, y: 115 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 115 },
  };

  const desktopVariants = {
    hidden: { opacity: 0, x: 100, y: 100 },
    visible: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 100, y: 100 },
  };

  const isCurrentEpisodePlaying =
    currentEpisode?.enclosureUrl === episode.enclosureUrl;

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    setPos({ x: info.point.x, y: info.point.y });
    setIsDragging(false);
  };

  return (
    <AnimatePresence>
      <div
        ref={constraintsRef}
        className="fixed inset-0 z-[55] pointer-events-none"
      >
        <motion.div
          className={`${modalBaseClasses} ${
            isDragging && isDesktop ? "cursor-grabbing" : "cursor-grab"
          }`}
          initial={isDesktop ? "hidden" : "hidden"}
          animate={isDesktop ? "visible" : "visible"}
          exit={isDesktop ? "exit" : "exit"}
          variants={isDesktop ? desktopVariants : mobileVariants}
          transition={{ duration: 0.3, ease: "easeOut" }}
          drag={isDesktop}
          dragMomentum={false}
          dragConstraints={constraintsRef}
          onDragStart={isDesktop ? () => setIsDragging(true) : undefined}
          onDragEnd={isDesktop ? handleDragEnd : undefined}
          style={isDesktop ? { x: pos.x, y: pos.y } : undefined}
        >
          <button
            className={buttonCloseClasses}
            onClick={handleClose}
            aria-label="Cerrar reproductor"
          >
            <CloseIcon />
          </button>

          <div className="flex items-center justify-between w-full sm:flex-col sm:justify-around sm:items-center sm:h-full">
            <div className="flex items-center gap-4 sm:flex-col sm:items-center w-full">
              {episode.image && (
                <img
                  src={getSecureImageUrl(episode.image)}
                  alt={`Imagen del podcast ${episode.podcastTitle}`}
                  className="w-[68px] h-[68px] sm:w-[200px] sm:h-[200px] rounded-md object-cover flex-shrink-0"
                  loading="lazy"
                />
              )}

              <div className="min-w-0 flex-1 flex flex-col sm:w-full sm:text-center pr-4 sm:pr-0">
                {isDesktop ? (
                  <>
                    <span className="font-Raleway font-black text-base sm:text-[22px] truncate block">
                      {episode.podcastTitle}
                    </span>
                    <h2 className="font-Raleway font-bold text-xs sm:text-[22px] sm:font-Ubuntu sm:font-bold truncate">
                      {episode.title}
                    </h2>
                  </>
                ) : (
                  <>
                    <h2 className="font-Raleway font-black text-base truncate">
                      {episode.title}
                    </h2>
                    <span className="font-Raleway font-bold text-xs truncate block">
                      {episode.podcastTitle}
                    </span>
                  </>
                )}

                <div className="sm:hidden w-full">
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={isCurrentEpisodePlaying ? currentTime : 0}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    className="w-full h-[3px] appearance-none rounded-lg cursor-pointer bg-white
                            [&::-webkit-slider-thumb]:w-[11px] [&::-webkit-slider-thumb]:h-[11px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none
                            [&::-moz-range-thumb]:w-[11px] [&::-moz-range-thumb]:h-[11px] [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full"
                    aria-label="Progreso de reproducción"
                    aria-valuemin={0}
                    aria-valuemax={duration || 0}
                    aria-valuenow={isCurrentEpisodePlaying ? currentTime : 0}
                    aria-valuetext={`${formatTime(
                      isCurrentEpisodePlaying ? currentTime : 0
                    )} de ${formatTime(
                      isCurrentEpisodePlaying ? duration : 0
                    )}`}
                  />
                  <div
                    className="flex justify-between text-[10px] text-white"
                    role="timer"
                  >
                    <span className="font-Roboto">
                      {formatTime(isCurrentEpisodePlaying ? currentTime : 0)}
                    </span>
                    <span className="font-Roboto">
                      {formatTime(isCurrentEpisodePlaying ? duration : 0)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlayPause}
                className="bg-white h-[40px] w-[40px] sm:h-[60px] sm:w-[60px] grid place-items-center flex-shrink-0 text-brand text-3xl p-3 rounded-full hover:bg-white/10 hover:text-white transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={
                  isPlaying && isCurrentEpisodePlaying ? "Pausar" : "Reproducir"
                }
                aria-pressed={isPlaying && isCurrentEpisodePlaying}
              >
                {isPlaying && isCurrentEpisodePlaying ? (
                  <PauseIcon
                    width={isDesktop ? 20 : 13}
                    height={isDesktop ? 20 : 15}
                  />
                ) : (
                  <PlayIcon
                    className="relative left-0.5"
                    width={isDesktop ? 24 : 16}
                    height={isDesktop ? 27 : 18}
                  />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PlaybackModal;
