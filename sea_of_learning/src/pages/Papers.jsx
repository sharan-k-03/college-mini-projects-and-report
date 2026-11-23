import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, FileText, Search, Upload, X } from "lucide-react";
import { usePapers } from "../context/PaperContext";
import { useAuth } from "../context/AuthContext";

const CURRENT_YEAR = new Date().getFullYear();

export default function Papers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { papers, bookmarkedIds, toggleBookmark, addPaper } = usePapers();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    authors: "",
    subject: "",
    year: CURRENT_YEAR,
    keywords: "",
    license: "CC BY 4.0",
    file: null,
    ownershipConfirmed: false,
  });

  const subjects = useMemo(
    () => ["All", ...new Set(papers.map((paper) => paper.subject).filter(Boolean))],
    [papers]
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return papers.filter((paper) => {
      const matchesSubject = subject === "All" || paper.subject === subject;
      const haystack = [paper.title, paper.abstract, paper.authors?.join(" "), paper.subject, ...(paper.keywords || [])]
        .join(" ")
        .toLowerCase();
      return matchesSubject && (!needle || haystack.includes(needle));
    });
  }, [papers, query, subject]);

  const openUpload = () => {
    if (!user) {
      navigate("/login", { state: { mode: "signin", returnTo: "/papers" } });
      return;
    }
    setUploadOpen(true);
  };

  const submitPaper = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.file) {
      setError("Select a PDF file.");
      return;
    }
    if (form.file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (form.title.trim().length < 5 || form.abstract.trim().length < 20) {
      setError("Add a descriptive title and abstract of at least 20 characters.");
      return;
    }
    if (!form.subject.trim() || !form.authors.trim()) {
      setError("Add at least one author and a subject.");
      return;
    }
    if (!form.ownershipConfirmed) {
      setError("Confirm that you own this paper or have permission to publish it.");
      return;
    }
    if (form.file.size > 50 * 1024 * 1024) {
      setError("PDF must be smaller than 50 MB.");
      return;
    }

    const paperId = `paper_${Date.now()}`;
    const published = await addPaper({
      id: paperId,
      title: form.title.trim(),
      abstract: form.abstract.trim(),
      authors: form.authors.split(",").map((name) => name.trim()).filter(Boolean),
      subject: form.subject.trim(),
      year: Number(form.year),
      keywords: form.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean),
      license: form.license,
      uploader: user.name,
      uploaderId: user.id,
      publicationStatus: "Local prototype",
      pdfUrl: "",
      views: 0,
      bookmarks: 0,
      comments: [],
    }, form.file);
    if (!published) {
      setError("Could not store the PDF on this device. Free some browser storage and try again.");
      return;
    }
    setUploadOpen(false);
    setForm({
      title: "",
      abstract: "",
      authors: "",
      subject: "",
      year: CURRENT_YEAR,
      keywords: "",
      license: "CC BY 4.0",
      file: null,
      ownershipConfirmed: false,
    });
    navigate(`/papers/${paperId}`);
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 pb-20 pt-6 sm:px-6 sm:pt-8">
      <section className="rounded-[28px] border border-[#cfc8b7] bg-[#20372f] px-5 py-8 text-white shadow-[0_18px_50px_rgba(38,48,42,.12)] sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d7c99d]">Experimental Reading Room</p>
            <h1 className="mt-3 max-w-xl text-4xl leading-none text-white sm:text-5xl">Research papers</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
              Browse abstracts, open PDFs, and try local paper publishing. Uploads remain on this browser in this prototype.
            </p>
          </div>
          <button
            type="button"
            onClick={openUpload}
            className="flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-[#d7c99d] px-5 py-3 text-sm font-bold text-[#20372f] transition hover:bg-[#eee8d5]"
          >
            <Upload size={16} /> Publish a paper
          </button>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search papers</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, abstract, author, or keyword"
            className="h-12 w-full rounded-2xl border border-[#dcd8cf] bg-[#fcfbf7] pl-10 pr-4 text-sm outline-none focus:border-[#52665d] focus:ring-2 focus:ring-[#52665d]/20 dark:border-white/10 dark:bg-white/[.03]"
          />
        </label>
        <select
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          aria-label="Filter by subject"
          className="h-12 rounded-2xl border border-[#dcd8cf] bg-[#fcfbf7] px-4 text-sm outline-none focus:border-[#52665d] dark:border-white/10 dark:bg-[#1b1c19]"
        >
          {subjects.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map((paper) => (
          <article key={paper.id} className="flex min-h-72 flex-col rounded-[24px] border border-[#dcd8cf] bg-[#fcfbf7] p-5 shadow-[0_14px_35px_rgba(38,48,42,.07)] dark:border-white/10 dark:bg-white/[.03]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eee8d5] text-[#52665d] dark:bg-white/10 dark:text-[#cbd4cb]">
                <FileText size={20} />
              </div>
              <button
                type="button"
                onClick={() => toggleBookmark(paper.id)}
                aria-label={bookmarkedIds.includes(paper.id) ? "Remove bookmark" : "Bookmark paper"}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  bookmarkedIds.includes(paper.id)
                    ? "border-[#52665d] bg-[#52665d] text-white"
                    : "border-[#dcd8cf] text-neutral-500 hover:border-[#52665d] dark:border-white/10"
                }`}
              >
                <Bookmark size={16} fill={bookmarkedIds.includes(paper.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#52665d] dark:text-[#b7c2b7]">
              {paper.subject} • {paper.year}
            </p>
            <h2 className="mt-2 text-xl leading-snug text-[#252724] dark:text-white">{paper.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{paper.abstract}</p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-5">
              <p className="text-xs text-neutral-500">{paper.authors?.join(", ")}</p>
              <Link to={`/papers/${paper.id}`} className="shrink-0 rounded-full border border-[#52665d] px-4 py-2 text-xs font-bold text-[#52665d] hover:bg-[#52665d] hover:text-white dark:text-[#cbd4cb]">
                Read paper
              </Link>
            </div>
          </article>
        ))}
      </div>

      {uploadOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm">
          <form onSubmit={submitPaper} className="my-6 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-[#dcd8cf] bg-[#fcfbf7] p-5 shadow-2xl dark:border-white/10 dark:bg-[#181817] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#52665d]">Local prototype</p>
                <h2 className="mt-1 text-2xl text-[#252724] dark:text-white">Publish a paper</h2>
              </div>
              <button type="button" onClick={() => setUploadOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/10" aria-label="Close upload">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-semibold">Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1.5 h-11 w-full rounded-xl border border-[#dcd8cf] bg-white px-3 text-sm font-normal outline-none focus:border-[#52665d] dark:border-white/10 dark:bg-white/[.05]" /></label>
              <label className="sm:col-span-2 text-sm font-semibold">Abstract<textarea required rows={4} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} className="mt-1.5 w-full rounded-xl border border-[#dcd8cf] bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#52665d] dark:border-white/10 dark:bg-white/[.05]" /></label>
              <label className="text-sm font-semibold">Authors<input required value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} placeholder="Comma separated" className="mt-1.5 h-11 w-full rounded-xl border border-[#dcd8cf] bg-white px-3 text-sm font-normal outline-none focus:border-[#52665d] dark:border-white/10 dark:bg-white/[.05]" /></label>
              <label className="text-sm font-semibold">Subject<input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1.5 h-11 w-full rounded-xl border border-[#dcd8cf] bg-white px-3 text-sm font-normal outline-none focus:border-[#52665d] dark:border-white/10 dark:bg-white/[.05]" /></label>
              <label className="text-sm font-semibold">Year<input required type="number" min="1900" max="2100" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-1.5 h-11 w-full rounded-xl border border-[#dcd8cf] bg-white px-3 text-sm font-normal outline-none focus:border-[#52665d] dark:border-white/10 dark:bg-white/[.05]" /></label>
              <label className="text-sm font-semibold">License<select value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} className="mt-1.5 h-11 w-full rounded-xl border border-[#dcd8cf] bg-white px-3 text-sm font-normal outline-none focus:border-[#52665d] dark:border-white/10 dark:bg-white/[.05]"><option>CC BY 4.0</option><option>CC BY-NC 4.0</option><option>CC0 1.0</option><option>Original — all rights reserved</option></select></label>
              <label className="sm:col-span-2 text-sm font-semibold">Keywords<input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="Comma separated" className="mt-1.5 h-11 w-full rounded-xl border border-[#dcd8cf] bg-white px-3 text-sm font-normal outline-none focus:border-[#52665d] dark:border-white/10 dark:bg-white/[.05]" /></label>
              <label className="sm:col-span-2 text-sm font-semibold">PDF file<input required type="file" accept="application/pdf,.pdf" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} className="mt-1.5 block w-full text-sm" /></label>
              <label className="sm:col-span-2 flex items-start gap-3 rounded-xl border border-[#dcd8cf] p-3 text-sm dark:border-white/10">
                <input type="checkbox" checked={form.ownershipConfirmed} onChange={(e) => setForm({ ...form, ownershipConfirmed: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[#20372f]" />
                <span>I confirm that I own this paper or have permission to publish it and agree that it may be removed for a valid copyright or safety complaint.</span>
              </label>
            </div>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <button type="submit" className="mt-5 min-h-12 w-full rounded-xl bg-[#20372f] px-4 py-3 text-sm font-bold text-white hover:bg-[#2f4a40]">Publish locally</button>
          </form>
        </div>
      )}
    </div>
  );
}
