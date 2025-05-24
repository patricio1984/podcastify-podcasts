import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { usePlaybackContext } from "./PlaybackContext";
import PlaybackModal from "./PlaybackModal";
import PodcastDetailModal from "../../components/PodcastDetailModal";
import { isFavorite } from "../favorites/favoritesUtils";

interface PlaybackModalData {
  type: "playback";
  episode: {
    id: number;
    title: string;
    enclosureUrl: string;
    podcastTitle: string;
    image: string;
  };
}

interface PodcastDetailModalData {
  type: "detail";
  feedId: number;
  podcastTitle: string;
  podcastImage: string;
  podcastDescription: string;
  isFavorite: boolean;
  toggleFavorite: (id: string) => void;
}

type ModalData = PlaybackModalData | PodcastDetailModalData;

interface ModalContextType {
  openModal: (data: ModalData) => void;
  closeModal: (modalType?: string) => void;
  isDetailModalOpen: boolean;
  isPlaybackModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [detailModalContent, setDetailModalContent] =
    useState<PodcastDetailModalData | null>(null);
  const [playbackModalContent, setPlaybackModalContent] =
    useState<PlaybackModalData | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { play } = usePlaybackContext();

  const openModal = useCallback(
    (data: ModalData) => {
      if (data.type === "playback") {
        play(data.episode);
        setPlaybackModalContent(data);
      } else if (data.type === "detail") {
        const currentIsFavorite = isFavorite(data.feedId);
        setDetailModalContent({
          ...data,
          isFavorite: currentIsFavorite,
        });
      }
    },
    [play]
  );

  const closeModal = useCallback((modalType?: string) => {
    if (modalType === "detail" || !modalType) {
      setDetailModalContent(null);
    }
    if (modalType === "playback" || !modalType) {
      setPlaybackModalContent(null);
    }
  }, []);

  const isDetailModalOpen = detailModalContent !== null;
  const isPlaybackModalOpen = playbackModalContent !== null;

  useEffect(() => {
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (document.activeElement === lastElement && !event.shiftKey) {
          firstElement.focus();
          event.preventDefault();
        } else if (document.activeElement === firstElement && event.shiftKey) {
          lastElement.focus();
          event.preventDefault();
        }
      }
    };

    if (isDetailModalOpen || isPlaybackModalOpen) {
      document.addEventListener("keydown", handleTabKey);
      return () => {
        document.removeEventListener("keydown", handleTabKey);
      };
    }
  }, [isDetailModalOpen, isPlaybackModalOpen]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isDetailModalOpen,
        isPlaybackModalOpen,
      }}
    >
      {children}
      {(isDetailModalOpen || isPlaybackModalOpen) &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 9999,
              pointerEvents: "none",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
            ref={modalRef}
            onClick={handleOverlayClick}
          >
            {/* Modal de detalles */}
            {detailModalContent && (
              <div style={{ pointerEvents: "auto" }}>
                <PodcastDetailModal
                  feedId={detailModalContent.feedId}
                  podcastTitle={detailModalContent.podcastTitle}
                  podcastImage={detailModalContent.podcastImage}
                  podcastDescription={detailModalContent.podcastDescription}
                  isFavorite={detailModalContent.isFavorite}
                  toggleFavorite={detailModalContent.toggleFavorite}
                  onClose={() => closeModal("detail")}
                />
              </div>
            )}

            {/* Modal de reproducción */}
            {playbackModalContent && (
              <div style={{ pointerEvents: "auto" }}>
                <PlaybackModal
                  episode={playbackModalContent.episode}
                  onClose={() => closeModal("playback")}
                />
              </div>
            )}
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
