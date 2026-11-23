import { Link } from "react-router-dom";
import { Eye, ThumbsUp, Clock } from "lucide-react";
import { formatViews, timeAgo } from "../utils/validators";

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.id}`} className="group flex min-w-0 flex-col rounded-2xl border border-transparent p-2 transition-all duration-200 hover:border-[#ddd7c8] hover:bg-[#fcfbf7] hover:shadow-[0_16px_40px_rgba(38,48,42,.08)] dark:hover:border-white/10 dark:hover:bg-white/[.03]">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-[#dedbd3] bg-[#e9e7df] dark:border-white/10 dark:bg-neutral-900">
        <img
          src={video.thumbnail}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 rounded-md bg-[#11110f]/85 px-1.5 py-1 text-[10px] font-semibold text-white">
          {video.duration}
        </span>
        {/* Category badge */}
        <span className="absolute left-2 top-2 rounded-full border border-white/20 bg-[#20372f]/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur">
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
          <h3 className="line-clamp-2 break-words text-sm font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-[#52665d] dark:text-white dark:group-hover:text-[#cbd4cb]">
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
