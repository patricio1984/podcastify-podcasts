import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePodcasts } from "../usePodcasts";
import { TestWrapper } from "../../../test/test-utils";

describe("usePodcasts", () => {
  it("should fetch podcasts successfully", async () => {
    const { result } = renderHook(() => usePodcasts(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.displayedPodcasts).toBeDefined();
    expect(Array.isArray(result.current.displayedPodcasts)).toBe(true);
    expect(result.current.displayedPodcasts.length).toBeGreaterThan(0);
  });
});
