import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "./features/playback/ModalContext";
import { PlaybackProvider } from "./features/playback/PlaybackContext";
import Header from "./components/Header";
import TogglePills from "./components/TogglePills";
import PodcastGrid from "./components/PodcastGrid";
import PodcastSkeletonGrid from "./components/skeletons/PodcastSkeletonGrid";
import { usePodcasts } from "./features/podcasts/usePodcasts";
import PWAPrompt from "./components/PWAPrompt";

const queryClient = new QueryClient();

function App() {
  const {
    activeTab,
    handleTabChange,
    toggleFavorite,
    displayedPodcasts,
    isSearching,
    isLoading,
    isError,
    error,
    loadMoreRef,
    isFetchingNextPage,
    searchQuery,
    setSearchQuery,
    favoritesCount,
    searchResults,
  } = usePodcasts();

  const renderContent = () => {
    if (
      (activeTab === "trending" && isLoading) ||
      (activeTab === "search" && isSearching)
    ) {
      return <PodcastSkeletonGrid />;
    }

    if (
      activeTab === "search" &&
      searchQuery.trim() !== "" &&
      !isSearching &&
      searchResults !== null &&
      searchResults.length === 0
    ) {
      return (
        <p className="text-center text-[25px] font-semibold text-black/70 py-10">
          No se encontraron resultados para "{searchQuery}"
        </p>
      );
    }

    if (activeTab === "favorites" && favoritesCount === 0) {
      return (
        <p className="text-center text-[25px] font-semibold text-black/70 py-10">
          No hay podcasts para mostrar en Favoritos.
        </p>
      );
    }

    return (
      <PodcastGrid
        podcasts={displayedPodcasts}
        toggleFavorite={toggleFavorite}
      />
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PlaybackProvider>
        <ModalProvider>
          <div className="scroll-smooth antialiased min-h-screen bg-white">
            <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <main className="px-8 md:px-15 md:py-[30px]">
              <TogglePills
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                favoritesCount={favoritesCount}
              />

              {isError && activeTab !== "search" ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-xl text-red-800 font-bold">
                    Error al cargar podcasts: {error?.message}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex-grow">{renderContent()}</div>

                  {activeTab === "trending" && (
                    <>
                      {isFetchingNextPage && (
                        <p className="text-center text-gray-500 pt-15">
                          Cargando más...
                        </p>
                      )}
                      <div ref={loadMoreRef} className="py-10 text-center" />
                    </>
                  )}
                </>
              )}
            </main>
            <PWAPrompt />
          </div>
        </ModalProvider>
      </PlaybackProvider>
    </QueryClientProvider>
  );
}

export default App;
