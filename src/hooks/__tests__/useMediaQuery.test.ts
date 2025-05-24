import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import useMediaQuery from "../useMediaQuery";

describe("useMediaQuery", () => {
  const matchMediaSpy = vi.fn();

  beforeEach(() => {
    window.matchMedia = matchMediaSpy;
  });

  it("returns true when media query matches", () => {
    matchMediaSpy.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("returns false when media query does not match", () => {
    matchMediaSpy.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);
  });

  it("updates when media query changes", () => {
    const addEventListenerMock = vi.fn();
    const mediaQueryList = {
      matches: false,
      addEventListener: addEventListenerMock,
      removeEventListener: vi.fn(),
    };

    matchMediaSpy.mockReturnValue(mediaQueryList);

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);

    const [[eventName, handler]] = addEventListenerMock.mock.calls;
    expect(eventName).toBe("change");

    act(() => {
      handler({ matches: true });
    });

    expect(result.current).toBe(true);
  });
});
