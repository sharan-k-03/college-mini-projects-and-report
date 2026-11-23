import { useAuth } from "../context/AuthContext";
import { useVideos } from "../context/VideoContext";
import VideoCard from "../components/VideoCard";
import { User, Bookmark, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, login } = useAuth();
  const { videos, savedIds } = useVideos();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-32 text-center">
        <User size={48} className="text-gray-300" strokeWidth={1.5} />
        <p className="text-gray-500 dark:text-gray-400">Please sign in to view your profile.</p>
        <button onClick={login} className="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
          Sign in
        </button>
      </div>
    );
  }

  const myVideos = videos.filter((v) => v.uploaderId === user.id);
  const savedVideos = videos.filter((v) => savedIds.includes(v.id));

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
      {/* Profile header */}
      <div className="mb-8 flex flex-wrap items-center gap-5 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-white/[.03] sm:p-7">
        <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full border-4 border-indigo-500/20" />
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
          className="ml-auto flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
        >
          <Upload size={15} /> Upload Video
        </Link>
      </div>

      {/* My uploads */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Upload size={18} className="text-indigo-500" /> My Uploads
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
    </div>
  );
}
