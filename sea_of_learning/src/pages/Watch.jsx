import { useEffect, useRef, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
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
import { getVideoBlob } from "../utils/mediaStorage";

export default function Watch() {
  const { id } = useParams();
  const { videos, likedIds, savedIds, progress, likeVideo, unlikeVideo, incrementViews, saveVideo, unsaveVideo, updateProgress, markComplete } =
    useVideos();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [playerUrl, setPlayerUrl] = useState("");

  const video = videos.find((v) => v.id === id);
  const mediaId = video?.mediaId;
  const videoSource = video?.videoUrl;
  useEffect(() => {
    let active = true;
    let blobUrl = null;

    async function resolvePlayerUrl() {
      if (!video) {
        setPlayerUrl("");
        return;
      }
      if (mediaId) {
        const blob = await getVideoBlob(mediaId);
        if (!active) return;
        if (blob) {
          blobUrl = URL.createObjectURL(blob);
          setPlayerUrl(blobUrl);
          return;
        }
      }
      setPlayerUrl(videoSource || "");
    }

    resolvePlayerUrl();
    return () => {
      active = false;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [id, mediaId, videoSource, video]);
  const related = videos.filter((v) => v.id !== id && v.category === video?.category).slice(0, 6);

  const hasViewed = useRef(new Set());
  useEffect(() => {
    if (video && !hasViewed.current.has(id)) {
      incrementViews(id);
      hasViewed.current.add(id);
    }
  }, [id, video?.id]); // eslint-disable-line

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center text-neutral-400">
        <BookOpen size={48} strokeWidth={1.5} />
        <p className="mt-4 text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">Video not found</p>
        <Link to="/" className="mt-3 text-[#52665d] dark:text-[#cbd4cb] hover:underline text-sm font-medium">
          Return to home
        </Link>
      </div>
    );
  }

  const isLiked = likedIds.includes(id);
  const isSaved = savedIds.includes(id);
  const currentProgress = progress?.[id] || { percentage: 0, completed: false };

  const savePlaybackProgress = (event) => {
    const media = event.currentTarget;
    if (!media.duration) return;
    updateProgress(id, (media.currentTime / media.duration) * 100);
  };

  const handleLike = () => {
    if (!user) {
      navigate("/login", { state: { mode: "signin", returnTo: location.pathname } });
      return;
    }
    if (isLiked) {
      unlikeVideo(id);
    } else {
      likeVideo(id);
    }
  };
  const handleSave = () => {
    if (!user) {
      navigate("/login", { state: { mode: "signin", returnTo: location.pathname } });
      return;
    }
    if (isSaved) {
      unsaveVideo(id);
    } else {
      saveVideo(id);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 py-5 sm:px-6 sm:py-8">
      {currentProgress.percentage > 0 && (
        <div className="mb-4 rounded-xl border border-[#dcd8cf] bg-[#faf9f6] px-4 py-3 dark:border-white/10 dark:bg-white/[.03]">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[#52665d] dark:text-neutral-300">
              {currentProgress.completed ? "Lecture completed" : "Your progress"}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">{currentProgress.completed ? 100 : currentProgress.percentage}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#e6e2d7] dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[#52665d]"
              style={{ width: `${currentProgress.completed ? 100 : currentProgress.percentage}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">
          {/* Video player */}
          <div className="aspect-video overflow-hidden rounded-[20px] border border-[#2f4a40]/30 bg-black shadow-[0_24px_70px_rgba(38,48,42,.16)]">
            <ReactPlayer
              url={playerUrl || video.videoUrl}
              controls
              width="100%"
              height="100%"
              onPause={savePlaybackProgress}
              onEnded={savePlaybackProgress}
              config={{ file: { attributes: { controlsList: "nodownload" } } }}
            />
          </div>

          {/* Video info */}
          <div className="mt-3 sm:mt-4 text-left">
            <h1 className="break-words text-lg font-bold leading-snug text-neutral-950 dark:text-white sm:text-2xl">
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
                      ? "bg-[#20372f] text-white"
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
                  onClick={async () => {
                    const shareData = { title: video.title, url: window.location.href };
                    if (navigator.share) {
                      await navigator.share(shareData).catch(() => {});
                    } else if (navigator.clipboard) {
                      await navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium
                             bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shrink-0"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => markComplete(id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0
                    ${currentProgress.completed
                      ? "bg-[#52665d] text-white"
                      : "border border-[#52665d] text-[#52665d] hover:bg-[#edf0e9] dark:text-neutral-200 dark:hover:bg-white/10"
                    }`}
                >
                  {currentProgress.completed ? "Completed" : "Mark complete"}
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
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#eee8d5] dark:bg-white/10 text-[#52665d] dark:text-[#cbd4cb] mt-0.5">
                    <User size={10} /> Educator
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#20372f] text-white text-[11px] font-semibold shrink-0">
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
