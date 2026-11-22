import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
      <div className="text-8xl font-black text-indigo-100 dark:text-indigo-900 select-none">404</div>
      <BookOpen size={48} className="text-indigo-400" strokeWidth={1.5} />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
        The page you're looking for doesn't exist. Head back and keep studying!
      </p>
      <Link to="/" className="mt-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
        Back to sea_of_learning
      </Link>
    </div>
  );
}
