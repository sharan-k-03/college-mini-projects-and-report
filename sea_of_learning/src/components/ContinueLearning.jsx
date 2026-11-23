import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export default function ContinueLearning({ videos, progress, limit = 3 }) {
  const items = videos
    .filter((video) => progress?.[video.id]?.percentage > 0 && !progress[video.id].completed)
    .sort((a, b) =>
      new Date(progress[b.id]?.updatedAt || 0) - new Date(progress[a.id]?.updatedAt || 0)
    )
    .slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#52665d] dark:text-[#aeb9ae]">
            Your library
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#252724] dark:text-white">
            Continue learning
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((video) => {
          const percentage = progress[video.id]?.percentage || 0;
          return (
            <article
              key={video.id}
              className="grid grid-cols-[112px_1fr] gap-3 rounded-xl border border-[#dcd8cf] bg-[#faf9f6] p-3 shadow-sm dark:border-white/10 dark:bg-white/[.03] sm:grid-cols-[140px_1fr]"
            >
              <Link
                to={`/watch/${video.id}`}
                className="relative aspect-video overflow-hidden rounded-lg bg-neutral-900"
              >
                <img
                  src={video.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf9f6]/95 text-[#20372f]">
                    <Play size={15} fill="currentColor" />
                  </span>
                </span>
              </Link>

              <div className="min-w-0 py-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#52665d] dark:text-[#aeb9ae]">
                  {video.category}
                </p>
                <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#252724] dark:text-white">
                  {video.title}
                </h3>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#e6e2d7] dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#52665d]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500">{percentage}%</span>
                </div>
                <Link
                  to={`/watch/${video.id}`}
                  className="mt-2 inline-flex text-xs font-semibold text-[#52665d] hover:underline dark:text-[#cbd4cb]"
                >
                  Resume
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
