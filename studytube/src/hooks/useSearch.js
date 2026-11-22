import { useState, useEffect, useMemo } from "react";

/**
 * useSearch — real-time debounced search + filter hook
 * Models how YouTube-like search works:
 *   1. Debounce input (300ms) to avoid re-rendering on every keystroke
 *   2. Lowercase match across title, description, and tags
 *   3. Category filter
 *   4. Sort by newest / most viewed / most liked
 */
export function useSearch(videos, initialCategory = "All") {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("newest"); // newest | views | likes

  // --- Debounce: wait 300ms after the user stops typing ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // --- Filter + Sort pipeline (memoized for performance) ---
  const results = useMemo(() => {
    let filtered = [...videos];

    // 1. Full-text search across title, description, tags
    if (debouncedQuery) {
      filtered = filtered.filter((v) => {
        const haystack = [
          v.title,
          v.description,
          ...(v.tags || []),
          v.uploader,
          v.category,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(debouncedQuery);
      });
    }

    // 2. Category filter
    if (category && category !== "All") {
      filtered = filtered.filter((v) => v.category === category);
    }

    // 3. Sort
    switch (sortBy) {
      case "views":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "likes":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
        );
        break;
    }

    return filtered;
  }, [videos, debouncedQuery, category, sortBy]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
    results,
    totalResults: results.length,
  };
}
