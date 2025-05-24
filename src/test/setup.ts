import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { MockAudio } from "./test-utils";

const mockAudio = new MockAudio();
vi.stubGlobal(
  "Audio",
  vi.fn(() => mockAudio)
);

const mockStorage = new Map();
const mockLocalStorage = {
  getItem: vi.fn((key: string) => mockStorage.get(key) || null),
  setItem: vi.fn((key: string, value: string) => mockStorage.set(key, value)),
  removeItem: vi.fn((key: string) => mockStorage.delete(key)),
  clear: vi.fn(() => mockStorage.clear()),
};
vi.stubGlobal("localStorage", mockLocalStorage);

const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query === "(max-width: 767px)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Element.prototype.scrollTo = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
  mockStorage.clear();
});
