import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Upload, Moon, Sun, User, LogOut, LogIn, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ query, setQuery, darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);

  const openLogin = (mode = "signin") => {
    navigate("/login", {
      state: {
        mode,
        returnTo: location.pathname + location.search,
      },
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#dcd8cf]/90 bg-[#faf9f6]/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#11110f]/95">
      <div className="mx-auto flex min-h-16 max-w-screen-2xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
        {/* Left Section: Clean Text Wordmark */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link to="/" className="group flex items-center py-1 select-none">
            <div className="flex items-center">
              <img
                src={`${import.meta.env.BASE_URL}sea-of-learning-mark.svg`}
                alt=""
                className="mr-2 h-8 w-8 shrink-0 rounded-lg shadow-sm"
              />
              <span className="font-display text-[17px] font-bold tracking-tight text-[#1d2a26] dark:text-white sm:text-xl">
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
                         bg-white/80 dark:bg-white/[.06] text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-[#52665d]/35 focus:border-[#52665d]
                         placeholder-gray-400 text-xs sm:text-sm"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-3 sm:px-4 rounded-r-full
                         bg-[#eee8d5] dark:bg-white/10 hover:bg-[#ddd4b8] dark:hover:bg-white/15
                         border-l border-gray-300 dark:border-gray-600
                         text-[#52665d] dark:text-neutral-300 transition-colors"
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
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#eee8d5] dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Upload */}
          <Link
            to="/papers"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
                       border border-[#dcd8cf] hover:border-[#52665d] text-[#52665d] dark:border-white/10 dark:text-neutral-300
                       text-xs sm:text-sm font-semibold transition-colors"
          >
            <FileText size={14} />
            <span className="hidden lg:inline">Papers</span>
          </Link>
          <Link
            to="/upload"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
                       bg-[#20372f] hover:bg-[#2f4a40] text-white text-xs sm:text-sm font-semibold
                       transition-colors shadow-sm"
          >
            <Upload size={14} />
            <span className="hidden xs:inline sm:inline">Upload</span>
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                onClick={() => setAccountOpen((open) => !open)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-[#d7c99d]"
                />
              </button>
              {/* Dropdown */}
              {accountOpen && (
              <div role="menu" className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <Link
                  to="/profile"
                  role="menuitem"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl"
                >
                  <User size={16} /> My Channel
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl text-left"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openLogin("signin")}
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
