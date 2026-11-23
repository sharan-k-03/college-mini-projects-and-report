import { createContext, useContext, useReducer, useEffect } from "react";
import { mockVideos } from "../data/mockVideos";

const VideoContext = createContext(null);

function videoReducer(state, action) {
  switch (action.type) {
    case "ADD_VIDEO":
      return { ...state, videos: [action.payload, ...state.videos] };

    case "LIKE_VIDEO":
      if (state.likedIds.includes(action.payload)) return state;
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload
            ? { ...v, likes: v.likes + 1 }
            : v
        ),
        likedIds: [...state.likedIds, action.payload],
      };

    case "UNLIKE_VIDEO":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload
            ? { ...v, likes: Math.max(0, v.likes - 1) }
            : v
        ),
        likedIds: state.likedIds.filter((id) => id !== action.payload),
      };

    case "INCREMENT_VIEWS":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload ? { ...v, views: v.views + 1 } : v
        ),
      };

    case "ADD_COMMENT":
      return {
        ...state,
        videos: state.videos.map((v) =>
          v.id === action.payload.videoId
            ? { ...v, comments: [...(v.comments || []), action.payload.comment] }
            : v
        ),
      };

    case "SAVE_VIDEO":
      if (state.savedIds.includes(action.payload)) return state;
      return {
        ...state,
        savedIds: [...state.savedIds, action.payload],
      };

    case "UNSAVE_VIDEO":
      return {
        ...state,
        savedIds: state.savedIds.filter((id) => id !== action.payload),
      };

    case "UPDATE_PROGRESS":
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.videoId]: {
            percentage: action.payload.percentage,
            completed: action.payload.completed,
            updatedAt: action.payload.updatedAt,
          },
        },
      };

    case "MARK_COMPLETE":
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload]: {
            ...(state.progress?.[action.payload] || {}),
            percentage: 100,
            completed: true,
            updatedAt: new Date().toISOString(),
          },
        },
      };

    default:
      return state;
  }
}

const STORAGE_KEY = "sea_of_learning_data";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const initialState = loadState() || {
  videos: mockVideos,
  likedIds: [],
  savedIds: [],
  progress: {},
};

export function VideoProvider({ children }) {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addVideo = (video) => dispatch({ type: "ADD_VIDEO", payload: video });
  const likeVideo = (id) => dispatch({ type: "LIKE_VIDEO", payload: id });
  const unlikeVideo = (id) => dispatch({ type: "UNLIKE_VIDEO", payload: id });
  const incrementViews = (id) => dispatch({ type: "INCREMENT_VIEWS", payload: id });
  const addComment = (videoId, comment) =>
    dispatch({ type: "ADD_COMMENT", payload: { videoId, comment } });
  const saveVideo = (id) => dispatch({ type: "SAVE_VIDEO", payload: id });
  const unsaveVideo = (id) => dispatch({ type: "UNSAVE_VIDEO", payload: id });
  const updateProgress = (videoId, percentage) =>
    dispatch({
      type: "UPDATE_PROGRESS",
      payload: {
        videoId,
        percentage: Math.max(0, Math.min(100, Math.round(percentage))),
        completed: state.progress?.[videoId]?.completed || false,
        updatedAt: new Date().toISOString(),
      },
    });
  const markComplete = (videoId) => dispatch({ type: "MARK_COMPLETE", payload: videoId });

  return (
    <VideoContext.Provider
      value={{
        videos: state.videos,
        likedIds: state.likedIds,
        savedIds: state.savedIds,
        progress: state.progress || {},
        addVideo,
        likeVideo,
        unlikeVideo,
        incrementViews,
        addComment,
        saveVideo,
        unsaveVideo,
        updateProgress,
        markComplete,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideos must be inside VideoProvider");
  return ctx;
}
