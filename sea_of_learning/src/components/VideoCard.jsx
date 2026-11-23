import { Link } from "react-router-dom";
import { Eye, ThumbsUp, Clock } from "lucide-react";
import { formatViews, timeAgo } from "../utils/validators";

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.id}`} className="group flex flex-col w-full">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-[#dedbd3] bg-[#e9e7df] dark:border-white/8 dark:bg-neutral-900">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-mono px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
        {/* Category badge */}
        <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[11px] font-medium px-2 py-0.5 rounded-full shadow-sm">
          {video.category}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-2.5 flex gap-2.5 items-start">
        {/* Avatar */}
        <img
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${video.uploaderId}`}
          alt={video.uploader}
          className="w-8 h-8 rounded-full shrink-0 mt-0.5"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 break-words text-sm font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
            {video.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {video.uploader}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
            <span className="inline-flex items-center gap-1">
              <Eye size={12} /> {formatViews(video.views)}
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp size={12} /> {formatViews(video.likes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {timeAgo(video.uploadDate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
