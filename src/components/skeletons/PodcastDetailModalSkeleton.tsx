export default function PodcastDetailModalSkeleton() {
  return (
    <div className="animate-pulse space-y-0 px-4 pb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
      </div>
      <ul className="space-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            data-testid="podcast-card"
            className={`flex gap-3 items-center justify-between p-3 transition-all duration-200 border-b border-white/30 ${
              i === 4 ? "border-b-0" : ""
            }`}
          >
            <div className="rounded-lg h-[40px] w-[40px] bg-gray-300 flex-shrink-0" />
            <div className="flex flex-col flex-grow mr-2 overflow-hidden">
              <div className="h-4 bg-gray-300 rounded w-4/5 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-2/5" />
            </div>
            <div className="bg-gray-300 h-8 w-8 rounded-full flex-shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  );
}
