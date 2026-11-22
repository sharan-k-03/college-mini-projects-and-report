import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";

/**
 * Floating switcher for UI Prototype (per prototype skill UI.md guidelines)
 * Mobile-friendly compact dimensions, clear text alignment, zero emojis.
 */
export default function PrototypeSwitcher({ variants, current }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentIndex = variants.findIndex((v) => v.id === current);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  const selectVariant = (index) => {
    const nextIndex = (index + variants.length) % variants.length;
    const nextVariant = variants[nextIndex];
    const newParams = new URLSearchParams(searchParams);
    newParams.set("variant", nextVariant.id);
    setSearchParams(newParams);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName) ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        selectVariant(activeIndex - 1);
      } else if (e.key === "ArrowRight") {
        selectVariant(activeIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, variants, searchParams]);

  const activeVariant = variants[activeIndex] || variants[0];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-2 px-3 py-2 bg-gray-900/95 text-white backdrop-blur-md rounded-full shadow-2xl border border-white/20 select-none max-w-[92vw]">
      <div className="hidden xs:flex items-center gap-1 text-[11px] text-indigo-400 font-semibold uppercase tracking-wider pr-2 border-r border-gray-700">
        <Layers size={13} />
        <span>Layout</span>
      </div>

      <button
        onClick={() => selectVariant(activeIndex - 1)}
        className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
        title="Previous layout (Left Arrow)"
        aria-label="Previous layout"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex items-center gap-1.5 text-xs font-medium justify-center text-center px-1">
        <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider">
          {activeVariant.id}
        </span>
        <span className="text-gray-200 text-xs truncate max-w-[120px] sm:max-w-[160px]">
          {activeVariant.name}
        </span>
      </div>

      <button
        onClick={() => selectVariant(activeIndex + 1)}
        className="p-1 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
        title="Next layout (Right Arrow)"
        aria-label="Next layout"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
