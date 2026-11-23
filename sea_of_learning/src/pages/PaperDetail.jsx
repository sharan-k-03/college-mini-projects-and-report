import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Bookmark, Download, Send, User } from "lucide-react";
import { usePapers } from "../context/PaperContext";
import { useAuth } from "../context/AuthContext";
import { getVideoBlob } from "../utils/mediaStorage";

export default function PaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { papers, bookmarkedIds, incrementViews, toggleBookmark, addComment } = usePapers();
  const { user } = useAuth();
  const paper = papers.find((item) => item.id === id);
  const counted = useRef(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (paper && !counted.current) {
      incrementViews(id);
      counted.current = true;
    }
  }, [id, paper, incrementViews]);

  useEffect(() => {
    let active = true;
    let objectUrl = null;
    async function resolvePdf() {
      if (!paper) return;
      if (paper.mediaId) {
        const blob = await getVideoBlob(paper.mediaId);
        if (!active) return;
        if (blob) {
          objectUrl = URL.createObjectURL(blob);
          setPdfUrl(objectUrl);
          return;
        }
      }
      setPdfUrl(paper.pdfUrl || "");
    }
    resolvePdf();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [paper]);

  if (!paper) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl">Paper not found</h1>
        <Link to="/papers" className="mt-5 rounded-full bg-[#20372f] px-5 py-3 text-sm font-bold text-white">Back to papers</Link>
      </div>
    );
  }

  const submitComment = (event) => {
    event.preventDefault();
    if (!user) {
      navigate("/login", { state: { mode: "signin", returnTo: `/papers/${paper.id}` } });
      return;
    }
    if (!comment.trim()) return;
    addComment(paper.id, {
      id: `paper_comment_${Date.now()}`,
      user: user?.name || "Guest",
      text: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    });
    setComment("");
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 py-6 sm:px-6 sm:py-8">
      <Link to="/papers" className="text-sm font-semibold text-[#52665d] dark:text-[#cbd4cb]">← Back to Research Papers</Link>
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 overflow-hidden rounded-[24px] border border-[#dcd8cf] bg-white dark:border-white/10 dark:bg-black">
          {pdfUrl ? (
            <iframe
              title={paper.title}
              src={`${pdfUrl}#toolbar=1&navpanes=0`}
              className="h-[70vh] min-h-[560px] w-full"
            />
          ) : (
            <div className="flex h-[70vh] items-center justify-center text-neutral-500">PDF preview unavailable</div>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-[24px] border border-[#dcd8cf] bg-[#fcfbf7] p-5 dark:border-white/10 dark:bg-white/[.03]">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#52665d] dark:text-[#b7c2b7]">{paper.subject} • {paper.year}</p>
            <h1 className="mt-2 text-3xl leading-tight text-[#252724] dark:text-white">{paper.title}</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{paper.abstract}</p>
            <dl className="mt-5 space-y-3 border-t border-[#dcd8cf] pt-4 text-sm dark:border-white/10">
              <div><dt className="text-xs text-neutral-500">Authors</dt><dd className="mt-1 font-semibold">{paper.authors?.join(", ")}</dd></div>
              <div><dt className="text-xs text-neutral-500">License</dt><dd className="mt-1">{paper.license}</dd></div>
              <div><dt className="text-xs text-neutral-500">Status</dt><dd className="mt-1">{paper.publicationStatus}</dd></div>
              <div><dt className="text-xs text-neutral-500">Views</dt><dd className="mt-1">{paper.views}</dd></div>
            </dl>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => toggleBookmark(paper.id)}
                className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-bold ${
                  bookmarkedIds.includes(paper.id) ? "border-[#52665d] bg-[#52665d] text-white" : "border-[#dcd8cf] text-[#52665d]"
                }`}
              >
                <Bookmark size={16} fill={bookmarkedIds.includes(paper.id) ? "currentColor" : "none"} />
                {bookmarkedIds.includes(paper.id) ? "Saved" : "Save"}
              </button>
              {pdfUrl && (
                <a href={pdfUrl} download={`${paper.title}.pdf`} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#20372f] px-4 text-sm font-bold text-white">
                  <Download size={16} /> PDF
                </a>
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#dcd8cf] bg-[#fcfbf7] p-5 dark:border-white/10 dark:bg-white/[.03]">
            <h2 className="flex items-center gap-2 text-sm font-bold"><User size={16} /> Discussion</h2>
            <form onSubmit={submitComment} className="mt-3 flex gap-2">
              <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder={user ? "Add a research note..." : "Sign in to comment"} className="h-11 min-w-0 flex-1 rounded-xl border border-[#dcd8cf] px-3 text-sm outline-none dark:border-white/10 dark:bg-white/[.05]" />
              <button type="submit" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#20372f] text-white" aria-label="Post comment"><Send size={16} /></button>
            </form>
            <div className="mt-4 space-y-3">
              {(paper.comments || []).map((item) => (
                <div key={item.id} className="rounded-xl bg-[#f1eee5] p-3 dark:bg-white/[.05]">
                  <p className="text-xs font-bold">{item.user}</p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
