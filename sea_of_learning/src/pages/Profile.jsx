import { useAuth } from "../context/AuthContext";
import { useVideos } from "../context/VideoContext";
import VideoCard from "../components/VideoCard";
import { User, Bookmark, Upload } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ContinueLearning from "../components/ContinueLearning";
import { usePapers } from "../context/PaperContext";
import { FileText } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { videos, savedIds, progress } = useVideos();
  const { papers, bookmarkedIds } = usePapers();

  if (!user) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#dcd8cf] bg-[#eee8d5] text-[#52665d] dark:border-white/10 dark:bg-white/[.05] dark:text-neutral-300">
          <User size={30} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl text-[#252724] dark:text-white">Your learning profile</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Please sign in to view saved lectures and progress.</p>
        <button
          onClick={() => navigate("/login", { state: { mode: "signin", returnTo: location.pathname } })}
          className="rounded-full bg-[#20372f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2f4a40]"
        >
          Sign in
        </button>
      </div>
    );
  }

  const myVideos = videos.filter((v) => v.uploaderId === user.id);
  const savedVideos = videos.filter((v) => savedIds.includes(v.id));
  const myPapers = papers.filter((paper) => paper.uploaderId === user.id);
  const savedPapers = papers.filter((paper) => bookmarkedIds.includes(paper.id));

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
      {/* Profile header */}
      <div className="mb-8 flex flex-wrap items-center gap-5 rounded-[28px] border border-[#dcd8cf] bg-[#fcfbf7] p-5 shadow-[0_16px_40px_rgba(38,48,42,.06)] dark:border-white/10 dark:bg-white/[.03] sm:p-7">
        <img src={user.avatar} alt="" className="h-20 w-20 rounded-full border-4 border-[#eee8d5]" />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span><strong className="text-gray-900 dark:text-white">{myVideos.length}</strong> videos</span>
            <span><strong className="text-gray-900 dark:text-white">{savedVideos.length}</strong> saved</span>
          </div>
        </div>
        <Link
          to="/upload"
          className="ml-auto flex min-h-11 items-center gap-2 rounded-full bg-[#20372f] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2f4a40]"
        >
          <Upload size={15} /> Upload Video
        </Link>
      </div>

      <ContinueLearning videos={videos} progress={progress} limit={3} />

      {/* My uploads */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Upload size={18} className="text-[#52665d]" /> My Uploads
        </h2>
        {myVideos.length === 0 ? (
          <p className="text-gray-400 text-sm italic">You haven't uploaded any study videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {myVideos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        )}
      </section>

      {/* Saved */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Bookmark size={18} className="text-amber-500" /> Saved Videos
        </h2>
        {savedVideos.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No saved videos yet. Click Save on any video.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {savedVideos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <FileText size={18} className="text-[#52665d]" /> Research Papers
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#dcd8cf] p-4 dark:border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">My papers</h3>
              <span className="text-xs text-neutral-500">{myPapers.length}</span>
            </div>
            {myPapers.length === 0 ? (
              <p className="text-sm italic text-neutral-400">No local papers published yet.</p>
            ) : (
              myPapers.map((paper) => (
                <Link key={paper.id} to={`/papers/${paper.id}`} className="block border-t border-[#e7e2d7] py-3 text-sm font-semibold hover:text-[#52665d] dark:border-white/10">
                  {paper.title}
                </Link>
              ))
            )}
          </div>
          <div className="rounded-2xl border border-[#dcd8cf] p-4 dark:border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">Saved papers</h3>
              <span className="text-xs text-neutral-500">{savedPapers.length}</span>
            </div>
            {savedPapers.length === 0 ? (
              <p className="text-sm italic text-neutral-400">No saved papers yet.</p>
            ) : (
              savedPapers.map((paper) => (
                <Link key={paper.id} to={`/papers/${paper.id}`} className="block border-t border-[#e7e2d7] py-3 text-sm font-semibold hover:text-[#52665d] dark:border-white/10">
                  {paper.title}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
