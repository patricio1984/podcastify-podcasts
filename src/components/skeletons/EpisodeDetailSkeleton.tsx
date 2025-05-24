export default function EpisodeDetailSkeleton() {
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between w-full sm:flex-col sm:justify-around sm:items-center sm:h-full gap-4 sm:gap-0 animate-pulse">
        <div className="w-[68px] h-[68px] sm:w-[200px] sm:h-[200px] rounded-md bg-gray-700 flex-shrink-0 sm:mb-4" />

        <div className="flex flex-col justify-center flex-grow min-h-[60px] w-full sm:text-center sm:px-4">
          <div className="h-6 bg-gray-700 rounded w-full mb-2 sm:h-8" />
          <div className="h-4 bg-gray-700 rounded w-3/4 sm:h-6" />

          <div className="sm:hidden w-full mt-4">
            <div className="h-3 bg-gray-700 rounded-lg w-full mb-1" />
            <div className="flex justify-between text-[10px] mt-1 gap-2">
              <div className="h-2 bg-gray-700 rounded w-1/4" />
              <div className="h-2 bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        </div>

        <div className="h-[40px] w-[40px] sm:h-[60px] sm:w-[60px] rounded-full bg-gray-700 flex-shrink-0" />
      </div>
    </div>
  );
}
