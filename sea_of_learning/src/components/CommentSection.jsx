import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { useVideos } from "../context/VideoContext";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/validators";
import { useLocation, useNavigate } from "react-router-dom";

export default function CommentSection({ video }) {
  const { addComment } = useVideos();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user) {
      navigate("/login", { state: { mode: "signin", returnTo: location.pathname } });
      return;
    }
    addComment(video.id, {
      id: `c_${Date.now()}`,
      user: user.name,
      text: text.trim(),
      date: new Date().toISOString().slice(0, 10),
    });
    setText("");
  };

  const comments = video.comments || [];

  return (
    <div className="mt-6 text-left">
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3.5 flex items-center gap-2">
        <MessageCircle size={16} className="text-indigo-500" />
        <span>{comments.length} Discussion Notes</span>
      </h3>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2.5 mb-5 items-start">
        <img
          src={user ? user.avatar : "https://api.dicebear.com/7.x/thumbs/svg?seed=guest"}
          alt="avatar"
          className="w-8 h-8 rounded-full shrink-0 mt-0.5"
        />
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={user ? "Add a study question or note..." : "Sign in to participate"}
            className="flex-1 px-3.5 py-2 rounded-xl sm:rounded-full border border-gray-200 dark:border-gray-700
                       bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="self-end sm:self-auto px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm
                       font-medium inline-flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
          >
            <Send size={13} />
            <span>Post</span>
          </button>
        </div>
      </form>

      {/* Comment list */}
      <div className="space-y-3.5">
        {comments.length === 0 && (
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 italic">
            No discussion notes yet. Ask a question or share key takeaways.
          </p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2.5 items-start">
            <img
              src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${c.user}`}
              alt={c.user}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 mt-0.5"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {c.user}
                </span>
                <span className="text-[11px] text-gray-400 shrink-0">
                  {timeAgo(c.date)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-0.5 break-words leading-relaxed">
                {c.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
