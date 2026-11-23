import { useEffect, useRef, useState } from "react";
import { X, Upload, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { validateUpload } from "../utils/validators";
import { useVideos } from "../context/VideoContext";
import { useAuth } from "../context/AuthContext";
import { useSubjects } from "../context/SubjectContext";
import { useNavigate } from "react-router-dom";
import { storeVideoBlob } from "../utils/mediaStorage";

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
  const uploadTimerRef = useRef(null);
  const redirectTimerRef = useRef(null);
  const previewUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreview = URL.createObjectURL(file);
    previewUrlRef.current = nextPreview;
    setForm((f) => ({ ...f, file }));
    setPreview(nextPreview);
  };

  const handleClose = () => {
    if (uploadTimerRef.current) clearTimeout(uploadTimerRef.current);
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    if (!success && previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    onClose();
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
    uploadTimerRef.current = setTimeout(async () => {
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
      if (form.file) {
        const stored = await storeVideoBlob(newVideo.id, form.file);
        if (!stored) {
          setUploading(false);
          setError("Could not store the video on this device. Free some browser storage and try again.");
          return;
        }
        newVideo.mediaId = newVideo.id;
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
      }
      addVideo(newVideo);
      setUploading(false);
      setSuccess(true);
      redirectTimerRef.current = setTimeout(() => {
        onClose();
        navigate(`/watch/${newVideo.id}`);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div role="dialog" aria-modal="true" aria-labelledby="upload-title" className="relative my-6 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[#dcd8cf] bg-[#fcfbf7] shadow-2xl dark:border-white/10 dark:bg-[#181817]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-4 pb-3.5 pt-5 dark:border-white/8 dark:bg-[#111114] sm:px-6">
          <h2 id="upload-title" className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Publish a study lecture</h2>
          <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
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
                  onClick={() => {
                    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
                    previewUrlRef.current = null;
                    setPreview(null);
                    setForm((f) => ({ ...f, file: null }));
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c9c3b4] bg-[#f6f4ee] px-4 text-center transition-all hover:border-[#52665d] hover:bg-[#eee8d5] dark:border-white/15 dark:bg-white/[.03] dark:hover:border-[#b7c2b7]">
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
                         focus:outline-none focus:ring-2 focus:ring-[#52665d]/30"
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
                         focus:outline-none focus:ring-2 focus:ring-[#52665d]/30"
            >
              <option value="">Select subject</option>
              {studyCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex items-center gap-1.5 text-xs text-[#52665d] dark:text-[#cbd4cb] mt-1.5">
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
                         focus:outline-none focus:ring-2 focus:ring-[#52665d]/30 resize-none"
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
                         focus:outline-none focus:ring-2 focus:ring-[#52665d]/30"
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
            className="w-full py-3 rounded-xl bg-[#20372f] hover:bg-[#2f4a40] disabled:opacity-50
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
