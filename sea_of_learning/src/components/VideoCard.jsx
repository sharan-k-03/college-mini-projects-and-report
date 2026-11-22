import { Link } from "react-router-dom";
import { Eye, ThumbsUp, Clock } from "lucide-react";
import { formatViews, timeAgo } from "../utils/validators";

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.id}`} className="group flex flex-col w-full">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 w-full">
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
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors break-words">
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
