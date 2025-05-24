import React from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

type SearchBarProps = {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchButtonClick: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  searchOpen: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  formRef: React.RefObject<HTMLFormElement | null>;
  isMobile: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchButtonClick,
  onSubmit,
  searchOpen,
  inputRef,
  formRef,
  isMobile,
}) => {
  const iconSize = isMobile ? "24" : searchOpen ? "30" : "40";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && searchOpen) {
      e.preventDefault();
      onSearchButtonClick();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      role="search"
      aria-expanded={searchOpen}
      onKeyDown={handleKeyDown}
      className={clsx(
        "flex items-center font-xl transition-all duration-300",
        "h-[70px]",
        {
          "absolute left-0 right-0 top-0 z-50": isMobile && searchOpen,
          "relative bg-white rounded-full max-w-[360px]":
            !isMobile || !searchOpen,
          "w-full": searchOpen,
          "w-12 justify-end": !searchOpen,
        }
      )}
    >
      {isMobile ? (
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 bg-neutral-200 z-0"
            />
          )}
        </AnimatePresence>
      ) : null}

      <div
        className={clsx("absolute inset-0 flex items-center", {
          "px-8": isMobile && searchOpen,
        })}
      >
        <label htmlFor="search-input" className="sr-only">
          Buscar podcasts
        </label>
        <div className="relative flex items-center justify-end w-full h-full">
          <motion.div
            className="w-full"
            initial={false}
            animate={{ width: searchOpen ? "100%" : "0%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <input
              id="search-input"
              ref={inputRef}
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={onSearchChange}
              aria-label="Buscar podcasts"
              className={clsx(
                "outline-none text-brand h-[70px] font-semibold w-full",
                "transition-all duration-300",
                {
                  "opacity-100": searchOpen,
                  "opacity-0": !searchOpen,
                  "bg-transparent border-2 border-brand rounded-full pl-4 pr-12 text-[25px] placeholder:text-black/70":
                    !isMobile && searchOpen,
                  "bg-neutral-200 border-0 pl-0 pr-12 text-[20px] placeholder:font-black placeholder:text-black/70":
                    isMobile && searchOpen,
                }
              )}
            />
          </motion.div>

          <button
            type="submit"
            className={clsx(
              "absolute h-[70px] w-12 flex items-center justify-center",
              "text-brand p-2 cursor-pointer",
              "z-10 focus:outline-none focus:ring-2 focus:ring-brand/50",
              {
                "right-[3px]": !isMobile || !searchOpen,
              }
            )}
            onClick={onSearchButtonClick}
            aria-label={searchOpen ? "Buscar" : "Abrir búsqueda"}
            aria-expanded={searchOpen}
          >
            <SearchIcon
              className="text-brand"
              width={iconSize}
              height={iconSize}
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
