import { Link, useNavigate } from "react-router-dom";
import { Search, Upload, Moon, Sun, User, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ query, setQuery, darkMode, setDarkMode }) {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#dcd8cf] bg-[#faf9f6]/95 backdrop-blur-xl dark:border-white/8 dark:bg-[#11110f]/95">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-2 px-3 sm:px-6">
        {/* Left Section: Clean Text Wordmark */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link to="/" className="group flex items-center py-1 select-none">
            <div className="flex items-center">
              <img
                src={`${import.meta.env.BASE_URL}sea-of-learning-mark.svg`}
                alt=""
                className="mr-2 h-8 w-8 shrink-0 rounded-lg shadow-sm"
              />
              <span className="font-display text-lg font-bold tracking-tight text-[#1d2a26] dark:text-white sm:text-xl">
                sea_of_learning
              </span>
            </div>
          </Link>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-1 sm:mx-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search study videos..."
              className="w-full pl-3.5 pr-10 py-2 sm:py-2.5 rounded-full border border-gray-300 dark:border-gray-600
                         bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                         placeholder-gray-400 text-xs sm:text-sm"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-3 sm:px-4 rounded-r-full
                         bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-800
                         border-l border-gray-300 dark:border-gray-600
                         text-gray-500 dark:text-gray-300 hover:text-indigo-600 transition-colors"
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Upload */}
          <Link
            to="/upload"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
                       bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium
                       transition-colors shadow-sm"
          >
            <Upload size={14} />
            <span className="hidden xs:inline sm:inline">Upload</span>
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-indigo-400"
                />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl"
                >
                  <User size={16} /> My Channel
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl text-left"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full border border-gray-300 dark:border-gray-600
                         text-gray-700 dark:text-gray-200 text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <LogIn size={14} />
              <span className="hidden xs:inline">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
