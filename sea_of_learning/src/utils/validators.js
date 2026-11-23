import { CATEGORIES } from "../data/mockVideos.js";

const getValidCategories = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("sea_of_learning_subjects") || "[]");
    const custom = Array.isArray(saved) ? saved : [];
    return CATEGORIES.filter((category) => category !== "All").concat(custom);
  } catch {
    return CATEGORIES.filter((category) => category !== "All");
  }
};

/**
 * Validates that an upload is study-related.
 * Returns { valid: boolean, error: string | null }
 */
export function validateUpload({ title, description, category, file }) {
  if (!file) {
    return { valid: false, error: "Please select a video file." };
  }
  const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only MP4, WebM, OGG, or MOV video files are allowed.",
    };
  }
  const maxSize = 500 * 1024 * 1024; // 500 MB
  if (file.size > maxSize) {
    return { valid: false, error: "Video file must be smaller than 500 MB." };
  }
  if (!title || title.trim().length < 5) {
    return { valid: false, error: "Title must be at least 5 characters." };
  }
  const studyCategories = getValidCategories();
  if (!category || !studyCategories.includes(category)) {
    return {
      valid: false,
      error: `Please select a valid academic category: ${studyCategories.join(", ")}.`,
    };
  }
  if (!description || description.trim().length < 20) {
    return {
      valid: false,
      error: "Description must be at least 20 characters.",
    };
  }
  return { valid: true, error: null };
}

export function formatViews(n) {
  const safeNum = Math.max(0, Number(n) || 0);
  if (safeNum >= 1_000_000) return (safeNum / 1_000_000).toFixed(1) + "M";
  if (safeNum >= 1_000) return (safeNum / 1_000).toFixed(1) + "K";
  return safeNum.toString();
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
