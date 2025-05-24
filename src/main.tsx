import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PlaybackProvider } from "./features/playback/PlaybackContext";
import { ModalProvider } from "./features/playback/ModalContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PlaybackProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </PlaybackProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
