import { useState, useRef, useEffect } from "react";

interface Episode {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
}

export const usePlayback = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playEpisode = (episode: Episode) => {
    if (audioRef.current) {
      audioRef.current.src = episode.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      setCurrentEpisode(episode);
      setDuration(episode.duration);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    currentEpisode,
    playEpisode,
    pause,
    seek,
  };
};
