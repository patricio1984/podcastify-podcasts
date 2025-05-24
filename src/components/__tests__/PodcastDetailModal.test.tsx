import { render, screen, fireEvent } from "../../test/test-utils";
import { describe, it, expect, vi } from "vitest";
import PodcastDetailModal from "../PodcastDetailModal";
import { ModalProvider } from "../../features/playback/ModalContext";
import { PlaybackProvider } from "../../features/playback/PlaybackContext";

describe("PodcastDetailModal", () => {
  const defaultProps = {
    feedId: 1,
    podcastTitle: "Test Podcast",
    podcastImage: "test.jpg",
    podcastDescription: "Test Description",
    isFavorite: false,
    toggleFavorite: vi.fn(),
    onClose: vi.fn(),
  };

  const renderWithProviders = (props = defaultProps) => {
    return render(
      <PlaybackProvider>
        <ModalProvider>
          <PodcastDetailModal {...props} />
        </ModalProvider>
      </PlaybackProvider>
    );
  };

  it("renders podcast details correctly", () => {
    renderWithProviders();
    expect(screen.getByText("Test Podcast")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("handles favorite toggle", () => {
    renderWithProviders();
    const favoriteButton = screen.getByLabelText("Agregar a favoritos");
    fireEvent.click(favoriteButton);
    expect(defaultProps.toggleFavorite).toHaveBeenCalledWith("1");
  });

  it("loads and displays episodes", async () => {
    renderWithProviders();
    expect(screen.getByText("Episodios")).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    renderWithProviders();
    const closeButton = screen.getByLabelText("Cerrar detalles del podcast");
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
