import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-screen-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#dcd8cf] bg-[#eee8d5] text-[#20372f] dark:border-white/10 dark:bg-white/[.06] dark:text-[#d7c99d]">
        <BookOpen size={38} strokeWidth={1.5} />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#52665d] dark:text-[#b7c2b7]">Error 404</p>
      <h1 className="mt-3 text-4xl text-[#252724] dark:text-white">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600 dark:text-neutral-400">
        The page you're looking for doesn't exist. Head back and keep studying!
      </p>
      <Link to="/" className="mt-6 rounded-full bg-[#20372f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f4a40]">
        Back to sea_of_learning
      </Link>
    </div>
  );
}
