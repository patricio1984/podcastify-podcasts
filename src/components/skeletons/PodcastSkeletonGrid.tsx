import useMediaQuery from "../../hooks/useMediaQuery";

export default function PodcastGridSkeleton() {
  const skeletons = Array.from({ length: 12 });
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <section
      aria-hidden="true"
      className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
    >
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-white rounded-2xl shadow-md overflow-hidden ${
            isMobile ? "flex h-auto" : "block h-[344px]"
          }`}
        >
          {isMobile ? (
            <>
              <div className="w-21 h-21 rounded-xl object-cover flex-shrink-0 self-center bg-gray-200 m-3" />
              <div className="flex flex-col justify-center px-3 py-2 flex-1 min-w-0 self-center">
                <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4 mt-2" />
              </div>
              <div className="w-5 h-5 bg-gray-200 self-center mr-3" />
            </>
          ) : (
            <>
              <div className="h-[216px] bg-gray-200 w-full" />
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-12 bg-gray-200 rounded w-full mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  );
}
