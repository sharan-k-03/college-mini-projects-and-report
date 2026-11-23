import { CATEGORIES } from "../data/mockVideos";

export default function CategoryChips({ selected, onSelect }) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all
            ${
              selected === cat
                ? "border border-[#2f4a40] bg-[#2f4a40] text-white shadow-sm"
                : "border border-[#dcd8cf] bg-[#faf9f6] text-[#65655f] hover:border-[#8f9a91] hover:text-[#1d2a26] dark:border-white/10 dark:bg-white/[.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
