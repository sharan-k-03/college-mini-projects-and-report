import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useSubjects } from "../context/SubjectContext";

export default function CategoryChips({ selected, onSelect }) {
  const { categories, addSubject } = useSubjects();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submitSubject = (event) => {
    event.preventDefault();
    const result = addSubject(name);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSelect(result.subject);
    setName("");
    setError("");
    setOpen(false);
  };

  return (
    <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-2">
      {categories.map((cat) => (
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
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          setError("");
        }}
        className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border border-dashed border-[#8f9a91] text-[#52665d] hover:bg-[#edf0e9] dark:border-white/20 dark:text-neutral-300"
      >
        {open ? <X size={14} /> : <Plus size={14} />}
        <span>{open ? "Close" : "Add subject"}</span>
      </button>

      {open && (
        <form
          onSubmit={submitSubject}
          className="fixed left-1/2 top-24 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-[#dcd8cf] bg-[#faf9f6] p-4 shadow-2xl dark:border-white/10 dark:bg-[#181817]"
        >
          <label htmlFor="new-subject" className="block text-sm font-semibold text-neutral-800 dark:text-white">
            Add a subject
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="new-subject"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Economics"
              autoFocus
              maxLength={40}
              className="min-w-0 flex-1 rounded-lg border border-[#dcd8cf] bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#52665d] dark:border-white/10 dark:bg-white/[.06] dark:text-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#2f4a40] px-4 py-2 text-sm font-semibold text-white"
            >
              Add
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </form>
      )}
    </div>
  );
}
