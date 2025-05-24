import React from "react";
import SearchBar from "../features/search/SearchBar";
import { useSearch } from "../features/search/useSearch";
import useMediaQuery from "../hooks/useMediaQuery";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const {
    searchOpen,
    inputRef,
    formRef,
    handleSearchButtonClick,
    handleInputChange,
    handleFormSubmit,
  } = useSearch(searchQuery, setSearchQuery);

  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <header className="h-[70px] relative bg-white mb-5 sm:mb-0">
      <div className="flex justify-between w-full items-center px-8 md:px-15 md:pt-[30px] md:pb-4">
        <h1
          className={`text-[40px] font-black text-brand transition-opacity duration-300 ${
            isMobile && searchOpen ? "opacity-0" : "opacity-100"
          }`}
        >
          Podcasts
        </h1>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleInputChange}
          onSearchButtonClick={handleSearchButtonClick}
          onSubmit={handleFormSubmit}
          searchOpen={searchOpen}
          inputRef={inputRef}
          formRef={formRef}
          isMobile={isMobile}
        />
      </div>
    </header>
  );
};

export default Header;
