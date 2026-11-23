import { useState } from "react";
import { X, Upload, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { validateUpload } from "../utils/validators";
import { useVideos } from "../context/VideoContext";
import { useAuth } from "../context/AuthContext";
import { useSubjects } from "../context/SubjectContext";
import { useNavigate } from "react-router-dom";

export default function UploadModal({ onClose }) {
  const { addVideo } = useVideos();
  const { user } = useAuth();
  const { categories } = useSubjects();
  const studyCategories = categories.filter((category) => category !== "All");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const validation = validateUpload(form);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setUploading(true);
    setTimeout(() => {
      const newVideo = {
        id: `v_${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        thumbnail: `https://picsum.photos/seed/${Date.now()}/400/225`,
        videoUrl: preview,
        uploader: user?.name || "Anonymous",
        uploaderId: user?.id || "u_guest",
        views: 0,
        likes: 0,
        duration: "0:00",
        uploadDate: new Date().toISOString().slice(0, 10),
        comments: [],
      };
      addVideo(newVideo);
      setUploading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate(`/watch/${newVideo.id}`);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-6 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-neutral-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111114]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-4 pb-3.5 pt-5 dark:border-white/8 dark:bg-[#111114] sm:px-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Upload Study Video</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-left">
          {/* File upload */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Video File <span className="text-red-500">*</span>
            </label>
            {preview ? (
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
                <video src={preview} controls className="w-full h-full" />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setForm((f) => ({ ...f, file: null })); }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all text-center px-4">
                <Upload size={24} className="text-gray-400 mb-1.5" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Click to select video</p>
                <p className="text-[11px] text-gray-400 mt-0.5">MP4, WebM, OGG up to 500 MB</p>
                <input type="file" accept="video/*" onChange={handleFile} className="hidden" />
              </label>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Introduction to Calculus"
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Academic Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select subject</option>
              {studyCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 mt-1.5">
              <ShieldAlert size={14} className="shrink-0" />
              <span>Only educational and study content is permitted</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Outline the concepts covered in this lecture..."
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. math, limits, calculus"
              className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error / Success feedback */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs sm:text-sm text-red-700 dark:text-red-400">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-xs sm:text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Video published successfully. Redirecting...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || success}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                       text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <span>Uploading lecture...</span>
            ) : (
              <>
                <Upload size={16} />
                <span>Publish Video</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
