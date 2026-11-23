export function paperReducer(state, action) {
  switch (action.type) {
    case "ADD_PAPER":
      return { ...state, papers: [action.payload, ...state.papers] };
    case "INCREMENT_VIEWS":
      return {
        ...state,
        papers: state.papers.map((paper) =>
          paper.id === action.payload ? { ...paper, views: paper.views + 1 } : paper
        ),
      };
    case "TOGGLE_BOOKMARK": {
      const bookmarked = state.bookmarkedIds.includes(action.payload);
      return {
        ...state,
        bookmarkedIds: bookmarked
          ? state.bookmarkedIds.filter((id) => id !== action.payload)
          : [...state.bookmarkedIds, action.payload],
        papers: state.papers.map((paper) =>
          paper.id === action.payload
            ? { ...paper, bookmarks: Math.max(0, paper.bookmarks + (bookmarked ? -1 : 1)) }
            : paper
        ),
      };
    }
    case "ADD_COMMENT":
      return {
        ...state,
        papers: state.papers.map((paper) =>
          paper.id === action.payload.paperId
            ? { ...paper, comments: [...(paper.comments || []), action.payload.comment] }
            : paper
        ),
      };
    default:
      return state;
  }
}
