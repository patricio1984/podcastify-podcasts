import { ReactElement, ReactNode } from "react";
import {
  render as rtlRender,
  RenderOptions,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import "@testing-library/jest-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface WrapperProps {
  children: ReactNode;
}

export const TestWrapper = ({ children }: WrapperProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, { wrapper: TestWrapper, ...options }),
  };
};

export class MockAudio {
  src: string = "";
  currentTime: number = 0;
  duration: number = 0;
  paused: boolean = true;
  volume: number = 1;
  play = vi.fn().mockImplementation(() => Promise.resolve());
  pause = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

export { customRender as render, screen, waitFor, fireEvent };
