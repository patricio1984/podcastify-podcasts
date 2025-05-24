import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { usePlayback } from "../hooks/usePlayback";
import { TestWrapper } from "../../../test/test-utils";

describe("usePlayback", () => {
  const mockEpisode = {
    id: "1",
    title: "Test Episode",
    audioUrl: "https://test.com/audio.mp3",
    duration: 300,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => usePlayback(), {
      wrapper: TestWrapper,
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(0);
    expect(result.current.duration).toBe(0);
    expect(result.current.currentEpisode).toBeNull();
  });

  it("should play episode", async () => {
    const { result } = renderHook(() => usePlayback(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      result.current.playEpisode(mockEpisode);
    });

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentEpisode).toEqual(mockEpisode);
  });

  it("should pause playback", async () => {
    const { result } = renderHook(() => usePlayback(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      result.current.playEpisode(mockEpisode);
      result.current.pause();
    });

    expect(result.current.isPlaying).toBe(false);
  });

  it("should seek to time", async () => {
    const { result } = renderHook(() => usePlayback(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      result.current.playEpisode(mockEpisode);
      result.current.seek(150);
    });

    expect(result.current.currentTime).toBe(150);
  });
});
