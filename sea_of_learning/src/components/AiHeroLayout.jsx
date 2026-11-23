import { Link } from "react-router-dom";
import { Sparkles, Terminal, ArrowRight, BookOpen, Layers, ShieldCheck, Play, Clock, Eye, Compass } from "lucide-react";
import { formatViews, timeAgo } from "../utils/validators";

export default function AiHeroLayout({ videos, selectedCategory, onSelectCategory }) {
  const featured = videos[0];
  const rest = videos.slice(1);

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Canvas: AI Hero Developer Aesthetic */}
      <section className="relative overflow-hidden rounded-lg border border-[#cbc5b8] bg-[#20372f] p-6 text-[#fffdf7] shadow-[0_18px_50px_rgba(38,48,42,.12)] sm:p-10 md:p-14">
        {/* Glow ambient effects */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-2/5 border-l border-white/10 bg-[radial-gradient(circle_at_70%_40%,rgba(220,196,135,.18),transparent_48%)]" />

        <div className="relative z-10 max-w-3xl space-y-6 text-left">
          {/* Eyebrow status pill */}
          <div className="inline-flex items-center gap-2 border-b border-[#bcae80] pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d7c99d]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d7c99d]" />
            <span>The independent learning library</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white">
            Master Every Subject. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              No Distractions.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-normal">
            An open educational platform engineered for rigorous, self-paced learning. 
            Structured curriculum pathways, university masterclasses, and interactive study notes.
          </p>

          {/* Interactive Shell / Codebox feature badge */}
          <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 font-mono text-xs text-neutral-300 flex items-center justify-between gap-4 max-w-lg">
            <div className="flex items-center gap-2 truncate">
              <Terminal size={14} className="text-indigo-400 shrink-0" />
              <span className="text-neutral-500">$</span>
              <span className="text-emerald-400 truncate">npx learn sea_of_learning --track=all</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase shrink-0">Terminal Ready</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {featured && (
              <Link
                to={`/watch/${featured.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-sm hover:bg-neutral-200 transition-all shadow-md group"
              >
                <Play size={15} className="fill-neutral-950" />
                <span>Start Featured Class</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 font-semibold text-sm transition-all"
            >
              <BookOpen size={15} />
              <span>Publish Lecture</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Structured Learning Pathways Bar */}
      <section className="space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
              Curriculum Tracks
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            {videos.length} Lectures Available
          </span>
        </div>

        {/* AI Hero Style Dark Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => (
            <Link
              key={v.id}
              to={`/watch/${v.id}`}
              className="group flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Thumbnail with Tech Badge */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-950">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-neutral-950/80 text-neutral-200 border border-neutral-700 backdrop-blur-xs">
                    {v.category}
                  </span>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-950/90 text-neutral-300">
                    {v.duration}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {v.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {v.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="truncate max-w-[140px] font-medium text-neutral-700 dark:text-neutral-300">
                  {v.uploader}
                </span>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span>{formatViews(v.views)} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
