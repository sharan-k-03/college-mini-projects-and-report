import { createContext, useContext, useEffect, useReducer } from "react";
import { mockPapers } from "../data/mockPapers";
import { storeVideoBlob } from "../utils/mediaStorage";
import { paperReducer } from "../utils/paperState";

const PaperContext = createContext(null);
const STORAGE_KEY = "sea_of_learning_papers";


function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.papers && Array.isArray(saved.papers)) return saved;
  } catch {}
  return { papers: mockPapers, bookmarkedIds: [] };
}

export function PaperProvider({ children }) {
  const [state, dispatch] = useReducer(paperReducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const addPaper = async (paper, file) => {
    if (file) {
      const stored = await storeVideoBlob(paper.id, file);
      if (!stored) return false;
    }
    dispatch({ type: "ADD_PAPER", payload: { ...paper, mediaId: file ? paper.id : undefined } });
    return true;
  };
  const incrementViews = (id) => dispatch({ type: "INCREMENT_VIEWS", payload: id });
  const toggleBookmark = (id) => dispatch({ type: "TOGGLE_BOOKMARK", payload: id });
  const addComment = (paperId, comment) =>
    dispatch({ type: "ADD_COMMENT", payload: { paperId, comment } });

  return (
    <PaperContext.Provider
      value={{
        papers: state.papers,
        bookmarkedIds: state.bookmarkedIds,
        addPaper,
        incrementViews,
        toggleBookmark,
        addComment,
      }}
    >
      {children}
    </PaperContext.Provider>
  );
}

export function usePapers() {
  const context = useContext(PaperContext);
  if (!context) throw new Error("usePapers must be inside PaperProvider");
  return context;
}
