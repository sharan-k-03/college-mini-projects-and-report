import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SortAsc } from "lucide-react";
import CategoryChips from "../components/CategoryChips";
import VideoGrid from "../components/VideoGrid";
import AiHeroLayout from "../components/AiHeroLayout";
import { VariantA, VariantB, VariantC } from "../components/HomePrototypes";
import PrototypeSwitcher from "../components/PrototypeSwitcher";
import { useVideos } from "../context/VideoContext";
import { useSearch } from "../hooks/useSearch";

const PROTOTYPE_VARIANTS = [
  { id: "aihero", name: "AI Hero Developer Style" },
  { id: "A", name: "Spotlight Hero + Grid" },
  { id: "B", name: "Curriculum Pathways" },
  { id: "C", name: "Syllabus List" },
  { id: "default", name: "Standard Grid" },
];

export default function Home({ query, setQuery }) {
  const { videos } = useVideos();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const variant = searchParams.get("variant") || "aihero";

  useEffect(() => {
    if (urlQuery) setQuery(urlQuery);
  }, [urlQuery]); // eslint-disable-line

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
    results,
    totalResults,
  } = useSearch(videos);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]); // eslint-disable-line

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28">
      {/* Category chips */}
      <CategoryChips selected={category} onSelect={setCategory} />

      {/* Sort + result count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-4 mb-5">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words">
          {searchQuery ? (
            <>
              <span className="font-semibold text-gray-800 dark:text-white">
                {totalResults}
              </span>{" "}
              results for &ldquo;
              <span className="text-indigo-600 dark:text-indigo-400">
                {searchQuery}
              </span>
              &rdquo;
            </>
          ) : (
            <span>
              <strong className="font-semibold text-gray-800 dark:text-white">
                {totalResults}
              </strong>{" "}
              educational lectures available
            </span>
          )}
        </p>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SortAsc size={16} className="text-gray-400 shrink-0" />
          <label htmlFor="sort-select" className="sr-only">Sort lectures</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Render selected UI Prototype Variant */}
      {variant === "aihero" && (
        <AiHeroLayout
          videos={results}
          selectedCategory={category}
          onSelectCategory={(cat) => setCategory(cat)}
        />
      )}
      {variant === "A" && (
        <VariantA
          videos={results}
          category={category}
          setCategory={setCategory}
        />
      )}
      {variant === "B" && (
        <VariantB
          videos={results}
          onSelectCategory={(cat) => setCategory(cat)}
        />
      )}
      {variant === "C" && <VariantC videos={results} />}
      {variant === "default" && <VideoGrid videos={results} />}

      {/* Floating prototype switcher bar */}
      <PrototypeSwitcher variants={PROTOTYPE_VARIANTS} current={variant} />
    </div>
  );
}
