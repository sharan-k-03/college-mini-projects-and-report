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
        <div className="relative overflow-hidden rounded-[24px] border border-[#20372f] bg-[#20372f] p-4 text-white shadow-[0_18px_50px_rgba(38,48,42,.12)] sm:p-7">
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
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d7c99d]/30 bg-[#d7c99d]/10 px-2.5 py-1 text-xs font-semibold text-[#d7c99d]">
                <Sparkles size={12} />
                <span>Featured Masterclass</span>
              </div>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold leading-snug break-words">
                <Link to={`/watch/${featured.id}`} className="hover:text-[#d7c99d] transition-colors">
                  {featured.title}
                </Link>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {featured.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#d7c99d]/90 pt-1">
                <span>By {featured.uploader}</span>
                <span>•</span>
                <span>{formatViews(featured.views)} views</span>
                <span>•</span>
                <span>{featured.duration}</span>
              </div>
              <div className="pt-2">
                <Link
                  to={`/watch/${featured.id}`}
                  className="inline-flex min-h-11 items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#d7c99d] text-[#20372f] font-semibold text-xs sm:text-sm hover:bg-[#eee8d5] transition-colors shadow-sm"
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
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#eee8d5] dark:bg-white/[.04] border border-[#dedbd1] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <Compass className="text-[#52665d] dark:text-[#b7c2b7] shrink-0" size={22} />
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Curriculum Pathways</h3>
            <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">Content organized into structured academic modules</p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded-md bg-[#20372f] text-white">
          {subjectNames.length} Subject Tracks
        </span>
      </div>

      {subjectNames.map((subject) => {
        const subjectVideos = grouped[subject];
        return (
          <section key={subject} className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#52665d] shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{subject}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">({subjectVideos.length})</span>
              </div>
              <button
                onClick={() => onSelectCategory && onSelectCategory(subject)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#52665d] dark:text-[#cbd4cb] hover:underline"
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
                  className="group flex gap-3 p-2.5 sm:p-3 rounded-xl bg-[#fcfbf7] dark:bg-white/[.03] border border-[#dedbd1] dark:border-white/10 hover:border-[#52665d]/50 transition-all shadow-xs"
                >
                  <div className="relative w-28 sm:w-32 aspect-video shrink-0 rounded-lg overflow-hidden bg-black/20">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-mono">
                      {v.duration}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#52665d] dark:group-hover:text-[#cbd4cb] leading-snug">
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
                <span className="inline-block text-[10px] font-semibold text-[#52665d] dark:text-[#cbd4cb] bg-[#eee8d5] dark:bg-white/10 px-2 py-0.5 rounded-full mb-1">
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
                        <Link to={`/watch/${v.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-[#52665d] dark:hover:text-[#cbd4cb] line-clamp-1">
                          {v.title}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{v.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#eee8d5] dark:bg-white/10 text-[#52665d] dark:text-[#cbd4cb] border border-[#dcd8cf] dark:border-white/10">
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
                      className="min-h-11 px-3 py-2 rounded-lg bg-[#20372f] hover:bg-[#2f4a40] text-white text-xs font-semibold transition-colors"
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

export function VariantD({ videos }) {
  const featured = videos[0];
  const shelf = videos.slice(1);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#cfc8b7] bg-[#e8e4d8] px-3 py-5 dark:border-white/10 dark:bg-[#171915] sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
        <div className="absolute left-[12%] top-[14%] h-32 w-32 rounded-full bg-[#c8ad70]/20 blur-3xl" />
        <div className="absolute bottom-[8%] right-[8%] h-40 w-40 rounded-full bg-[#52665d]/20 blur-3xl" />
      </div>

      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)] lg:items-center">
        {featured ? (
          <Link
            to={`/watch/${featured.id}`}
            className="study-stage group block [perspective:1200px]"
          >
            <article className="study-stage-card relative aspect-[16/10] overflow-hidden rounded-[26px] border border-white/70 bg-[#20372f] shadow-[0_28px_70px_rgba(38,48,42,.28),0_8px_0_#c2b99e] transition-transform duration-300 group-hover:[transform:rotateX(2deg)_rotateY(-3deg)_translateY(-5px)] dark:border-white/10 dark:shadow-[0_28px_70px_rgba(0,0,0,.45),0_8px_0_#31352f]">
              <img
                src={featured.thumbnail}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111a16] via-[#111a16]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white sm:p-7">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#d7c99d] backdrop-blur">
                  Featured lecture
                </span>
                <h2 className="mt-3 max-w-xl text-2xl leading-tight text-white sm:text-4xl">
                  {featured.title}
                </h2>
                <div className="mt-4 flex items-center gap-3 text-xs text-white/75">
                  <span>{featured.category}</span>
                  <span aria-hidden="true">•</span>
                  <span>{featured.duration}</span>
                  <span aria-hidden="true">•</span>
                  <span>{formatViews(featured.views)} views</span>
                </div>
              </div>
            </article>
          </Link>
        ) : (
          <div className="aspect-[16/10] rounded-[26px] border border-[#dcd8cf] bg-[#f8f6ef] dark:border-white/10 dark:bg-white/[.03]" />
        )}

        <div className="study-shelf [perspective:1000px]">
          <div className="mb-3 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#52665d] dark:text-[#b7c2b7]">
                Spatial library
              </p>
              <h2 className="mt-1 text-xl text-[#252724] dark:text-white sm:text-2xl">
                Choose your next lecture
              </h2>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {videos.length} lessons
            </span>
          </div>

          <div className="space-y-2.5">
            {shelf.map((video) => (
              <Link
                key={video.id}
                to={`/watch/${video.id}`}
                className="study-shelf-card group flex min-h-[76px] items-center gap-3 rounded-2xl border border-[#dedbd1] bg-[#fcfbf7] p-2.5 shadow-[0_8px_24px_rgba(38,48,42,.08),0_3px_0_#ddd7c8] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(38,48,42,.14),0_3px_0_#c7bfaa] dark:border-white/10 dark:bg-[#1d201c] dark:shadow-[0_8px_24px_rgba(0,0,0,.25),0_3px_0_#30352f]"
              >
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-900 sm:h-16 sm:w-24">
                  <img
                    src={video.thumbnail}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-[9px] text-white">
                    {video.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#52665d] dark:text-[#b7c2b7]">
                    {video.category}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#252724] group-hover:text-[#52665d] dark:text-white dark:group-hover:text-[#cbd4cb]">
                    {video.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
