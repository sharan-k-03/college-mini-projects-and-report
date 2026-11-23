import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useSubjects } from "../context/SubjectContext";
import { useVideos } from "../context/VideoContext";

export default function CategoryChips({ selected, onSelect }) {
  const { categories, customSubjects, addSubject, renameSubject, deleteSubject } = useSubjects();
  const { reassignCategory } = useVideos();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");

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

  const startRename = (subject) => {
    setEditingSubject(subject);
    setEditName(subject);
    setEditError("");
  };

  const submitRename = (event) => {
    event.preventDefault();
    const result = renameSubject(editingSubject, editName);
    if (!result.ok) {
      setEditError(result.error);
      return;
    }
    if (result.changed) {
      reassignCategory(editingSubject, result.subject);
      if (selected === editingSubject) onSelect(result.subject);
    }
    setEditingSubject(null);
    setEditName("");
    setEditError("");
  };

  const removeSubject = (subject) => {
    if (!window.confirm(`Delete "${subject}"? Lectures in this subject will move to General.`)) {
      return;
    }
    const result = deleteSubject(subject);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    reassignCategory(subject, "General");
    if (selected === subject) onSelect("All");
  };

  return (
    <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-2" aria-label="Subject filters">
      {categories.map((cat) => {
        const isCustom = customSubjects.includes(cat);
        const active = selected === cat;

        return (
          <div key={cat} className="flex shrink-0 items-center">
            <button
              onClick={() => onSelect(cat)}
              aria-pressed={active}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                isCustom ? "rounded-l-full" : "rounded-full"
              } ${
                active
                  ? "border border-[#2f4a40] bg-[#2f4a40] text-white shadow-sm"
                  : "border border-[#dcd8cf] bg-[#faf9f6] text-[#65655f] hover:border-[#8f9a91] hover:text-[#1d2a26] dark:border-white/10 dark:bg-white/[.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
            {isCustom && (
              <div className="ml-[-1px] flex overflow-hidden rounded-r-full border border-l-0 border-[#dcd8cf] bg-[#faf9f6] dark:border-white/10 dark:bg-white/[.04]">
                <button
                  type="button"
                  onClick={() => startRename(cat)}
                  className="flex h-9 w-9 items-center justify-center text-[#52665d] hover:bg-[#eee8d5] dark:text-neutral-300 dark:hover:bg-white/10"
                  aria-label={`Rename ${cat}`}
                  title={`Rename ${cat}`}
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => removeSubject(cat)}
                  className="flex h-9 w-9 items-center justify-center text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  aria-label={`Delete ${cat}`}
                  title={`Delete ${cat}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        );
      })}
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

      {editingSubject && (
        <form
          onSubmit={submitRename}
          className="fixed left-1/2 top-24 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-[#dcd8cf] bg-[#faf9f6] p-4 shadow-2xl dark:border-white/10 dark:bg-[#181817]"
        >
          <div className="flex items-center justify-between">
            <label htmlFor="edit-subject" className="block text-sm font-semibold text-neutral-800 dark:text-white">
              Rename subject
            </label>
            <button
              type="button"
              onClick={() => setEditingSubject(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10"
              aria-label="Close rename subject"
            >
              <X size={15} />
            </button>
          </div>
          <div className="mt-2 flex gap-2">
            <input
              id="edit-subject"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              autoFocus
              maxLength={40}
              className="min-w-0 flex-1 rounded-lg border border-[#dcd8cf] bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#52665d] dark:border-white/10 dark:bg-white/[.06] dark:text-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#2f4a40] px-4 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>
          </div>
          {editError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{editError}</p>}
        </form>
      )}
    </div>
  );
}
