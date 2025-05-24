import StarIcon from "../assets/icons/StarIcon";

type TabType = "trending" | "favorites" | "search";

type TogglePillsProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  favoritesCount: number;
};

export default function TogglePills({
  activeTab,
  setActiveTab,
  favoritesCount,
}: TogglePillsProps) {
  return (
    <div className="flex justify-between gap-4 md:justify-start md:space-x-4 mb-8">
      <button
        onClick={() => setActiveTab("trending")}
        className={`h-10 px-4 rounded-full font-bold text-xl transition border border-brand cursor-pointer flex-1 md:flex-none md:mr-0 max-w-[115px] flex items-center justify-center ${
          activeTab === "trending"
            ? "bg-brand text-white"
            : "bg-white text-brand"
        }`}
        aria-pressed={activeTab === "trending"}
      >
        Trending
      </button>

      <button
        onClick={() => setActiveTab("favorites")}
        className={`h-10 flex items-center justify-center space-x-2 px-4 py-2 rounded-full font-semibold text-xl transition border border-brand cursor-pointer flex-1 md:flex-none ${
          activeTab === "favorites"
            ? "bg-brand text-white"
            : "bg-white text-brand"
        }`}
        aria-pressed={activeTab === "favorites"}
      >
        <StarIcon
          className={`flex items-center justify-center ${
            activeTab === "favorites" ? "text-white" : "text-brand"
          }`}
        />
        <span>Favoritos</span>
        <span
          className={`font-Ubuntu text-xl font-bold rounded-full w-[30px] h-[30px] flex items-center justify-center select-none leading-none tabular-nums ${
            activeTab === "favorites"
              ? "bg-white text-brand"
              : "bg-brand text-white"
          }`}
        >
          {favoritesCount}
        </span>
      </button>
    </div>
  );
}
