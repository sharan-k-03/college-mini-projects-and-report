import { Link } from "react-router-dom";
import { BookOpen, Clock, Eye, ThumbsUp, Sparkles, Compass, ArrowRight } from "lucide-react";
import { formatViews, timeAgo } from "../utils/validators";
import VideoGrid from "./VideoGrid";

/**
 * Variant A: Traditional Grid + Featured Hero Study Spotlight
 * Optimized for mobile readability with responsive padding and text wrapping.
 */
export function VariantA({ videos }) {
  const featured = videos[0];
  const rest = videos.slice(1);

  return (
    <div className="space-y-6">
      {featured && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-4 sm:p-7 shadow-xl border border-indigo-800/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
            <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-lg bg-black/40 border border-white/10 shrink-0">
              <Link to={`/watch/${featured.id}`} className="block w-full h-full">
                <img
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
            <div className="w-full md:w-1/2 space-y-2.5 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                <Sparkles size={12} />
                <span>Featured Masterclass</span>
              </div>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold leading-snug break-words">
                <Link to={`/watch/${featured.id}`} className="hover:text-indigo-300 transition-colors">
                  {featured.title}
                </Link>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {featured.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-indigo-200/90 pt-1">
                <span>By {featured.uploader}</span>
                <span>•</span>
                <span>{formatViews(featured.views)} views</span>
                <span>•</span>
                <span>{featured.duration}</span>
              </div>
              <div className="pt-2">
                <Link
                  to={`/watch/${featured.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white text-indigo-950 font-semibold text-xs sm:text-sm hover:bg-indigo-50 transition-colors shadow-sm"
                >
                  <BookOpen size={15} />
                  <span>Start Learning</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
          All Study Lectures ({videos.length})
        </h3>
        <VideoGrid videos={rest.length > 0 ? rest : videos} />
      </div>
    </div>
  );
}

/**
 * Variant B: Curriculum Pathways
 * Groups lectures by subject with responsive card orientation.
 */
export function VariantB({ videos, onSelectCategory }) {
  const grouped = videos.reduce((acc, video) => {
    acc[video.category] = acc[video.category] || [];
    acc[video.category].push(video);
    return acc;
  }, {});

  const subjectNames = Object.keys(grouped);

  return (
    <div className="space-y-8">
      <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <Compass className="text-indigo-600 dark:text-indigo-400 shrink-0" size={22} />
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Curriculum Pathways</h3>
            <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">Content organized into structured academic modules</p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-600 text-white">
          {subjectNames.length} Subject Tracks
        </span>
      </div>

      {subjectNames.map((subject) => {
        const subjectVideos = grouped[subject];
        return (
          <section key={subject} className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{subject}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">({subjectVideos.length})</span>
              </div>
              <button
                onClick={() => onSelectCategory && onSelectCategory(subject)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Explore track</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {subjectVideos.map((v) => (
                <Link
                  key={v.id}
                  to={`/watch/${v.id}`}
                  className="group flex gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 transition-all shadow-xs"
                >
                  <div className="relative w-28 sm:w-32 aspect-video shrink-0 rounded-lg overflow-hidden bg-black/20">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-mono">
                      {v.duration}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 leading-snug">
                        {v.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{v.uploader}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 mt-1">
                      <span>{formatViews(v.views)} views</span>
                      <span>•</span>
                      <span>{timeAgo(v.uploadDate)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/**
 * Variant C: Syllabus List
 * Mobile card stack transitioning to desktop table for optimal legibility.
 */
export function VariantC({ videos }) {
  return (
    <div className="space-y-4">
      {/* Mobile view: readable stacked cards */}
      <div className="block md:hidden space-y-2.5">
        {videos.map((v) => (
          <Link
            key={v.id}
            to={`/watch/${v.id}`}
            className="block p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-2"
          >
            <div className="flex gap-3 items-start">
              <img src={v.thumbnail} alt={v.title} className="w-20 aspect-video object-cover rounded-md shrink-0 bg-black/20" />
              <div className="min-w-0 flex-1">
                <span className="inline-block text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full mb-1">
                  {v.category}
                </span>
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                  {v.title}
                </h4>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-800">
              <span className="truncate max-w-[130px] font-medium text-gray-700 dark:text-gray-300">{v.uploader}</span>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="flex items-center gap-1"><Clock size={11} /> {v.duration}</span>
                <span>•</span>
                <span>{formatViews(v.views)} views</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop view: table */}
      <div className="hidden md:block border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Lecture</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Educator</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Metrics</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {videos.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={v.thumbnail} alt={v.title} className="w-16 h-10 object-cover rounded-md shrink-0 bg-black/10" />
                      <div className="min-w-0">
                        <Link to={`/watch/${v.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1">
                          {v.title}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{v.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                      {v.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium">
                    {v.uploader}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-mono">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {v.duration}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Eye size={12} /> {formatViews(v.views)}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={12} /> {formatViews(v.likes)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      to={`/watch/${v.id}`}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                    >
                      Study Now
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
