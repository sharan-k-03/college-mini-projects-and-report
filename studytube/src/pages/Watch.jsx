import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ThumbsUp,
  Bookmark,
  Share2,
  Eye,
  Tag,
  User,
  BookOpen,
} from "lucide-react";
import ReactPlayer from "react-player";
import { useVideos } from "../context/VideoContext";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import VideoCard from "../components/VideoCard";
import { formatViews, timeAgo } from "../utils/validators";

export default function Watch() {
  const { id } = useParams();
  const { videos, likedIds, savedIds, likeVideo, unlikeVideo, incrementViews, saveVideo, unsaveVideo } =
    useVideos();
  const { user, login } = useAuth();

  const video = videos.find((v) => v.id === id);
  const related = videos.filter((v) => v.id !== id && v.category === video?.category).slice(0, 6);

  const hasViewed = useRef(false);
  useEffect(() => {
    if (video && !hasViewed.current) {
      incrementViews(id);
      hasViewed.current = true;
    }
  }, [id]); // eslint-disable-line

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-gray-400">
        <BookOpen size={48} strokeWidth={1.5} />
        <p className="mt-4 text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">Video not found</p>
        <Link to="/" className="mt-3 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
          Return to home
        </Link>
      </div>
    );
  }

  const isLiked = likedIds.includes(id);
  const isSaved = savedIds.includes(id);

  const handleLike = () => {
    if (!user) { login(); return; }
    isLiked ? unlikeVideo(id) : likeVideo(id);
  };
  const handleSave = () => {
    if (!user) { login(); return; }
    isSaved ? unsaveVideo(id) : saveVideo(id);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Video player */}
          <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-lg">
            <ReactPlayer
              url={video.videoUrl}
              controls
              width="100%"
              height="100%"
              config={{ file: { attributes: { controlsList: "nodownload" } } }}
            />
          </div>

          {/* Video info */}
          <div className="mt-3 sm:mt-4 text-left">
            <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white leading-snug break-words">
              {video.title}
            </h1>

            {/* Stats + actions row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={15} /> {formatViews(video.views)} views
                </span>
                <span>•</span>
                <span>{timeAgo(video.uploadDate)}</span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0
                    ${isLiked
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  <ThumbsUp size={14} className={isLiked ? "fill-white" : ""} />
                  <span>{formatViews(video.likes)}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0
                    ${isSaved
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  <Bookmark size={14} className={isSaved ? "fill-white" : ""} />
                  <span>{isSaved ? "Saved" : "Save"}</span>
                </button>

                <button
                  onClick={() => navigator.share?.({ title: video.title, url: window.location.href })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium
                             bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shrink-0"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Uploader + description card */}
            <div className="mt-4 p-3.5 sm:p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800/80">
              <div className="flex items-center gap-3 mb-2.5">
                <img
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${video.uploaderId}`}
                  alt={video.uploader}
                  className="w-9 h-9 rounded-full shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">{video.uploader}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 mt-0.5">
                    <User size={10} /> Educator
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-semibold shrink-0">
                  {video.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-line">
                {video.description}
              </p>
              {video.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                  <Tag size={12} className="text-gray-400 mt-0.5 shrink-0" />
                  {video.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <CommentSection video={video} />
          </div>
        </div>

        {/* Related sidebar */}
        {related.length > 0 && (
          <aside className="lg:w-80 xl:w-96 shrink-0 mt-6 lg:mt-0">
            <h2 className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider text-left">
              Related in {video.category}
            </h2>
            <div className="space-y-3.5">
              {related.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
