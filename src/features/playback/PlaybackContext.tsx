import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useEffect,
} from "react";
import { Episode } from "../../types";

interface PlaybackContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  play: (episode: Episode) => Promise<void>;
  pause: () => void;
  stop: () => void;
  seekTo: (seconds: number) => void;
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(
  undefined
);

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audioRef.current]);

  const seekTo = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const play = async (episode: Episode) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(episode.enclosureUrl);
        setCurrentEpisode(episode);
      } else if (currentEpisode?.enclosureUrl !== episode.enclosureUrl) {
        audioRef.current.src = episode.enclosureUrl;
        audioRef.current.load();
        setCurrentEpisode(episode);
      }

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);

      try {
        audioRef.current = new Audio(episode.enclosureUrl);
        setCurrentEpisode(episode);
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (retryError) {
        console.error("Error on retry:", retryError);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
    }
    setCurrentEpisode(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <PlaybackContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        play,
        pause,
        stop,
        duration,
        currentTime,
        seekTo,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlaybackContext() {
  const context = useContext(PlaybackContext);
  if (context === undefined) {
    throw new Error(
      "usePlaybackContext must be used within a PlaybackProvider"
    );
  }
  return context;
}
