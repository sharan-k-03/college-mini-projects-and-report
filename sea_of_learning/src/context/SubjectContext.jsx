import { createContext, useContext, useEffect, useState } from "react";
import { CATEGORIES } from "../data/mockVideos";

const SubjectContext = createContext(null);
const SUBJECTS_KEY = "sea_of_learning_subjects";

function loadCustomSubjects() {
  try {
    const saved = JSON.parse(localStorage.getItem(SUBJECTS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function SubjectProvider({ children }) {
  const [customSubjects, setCustomSubjects] = useState(loadCustomSubjects);

  useEffect(() => {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(customSubjects));
  }, [customSubjects]);

  const addSubject = (name) => {
    const subject = name.trim().replace(/\s+/g, " ").slice(0, 40);
    if (!subject) return { ok: false, error: "Enter a subject name." };

    const existing = [...CATEGORIES, ...customSubjects]
      .some((category) => category.toLowerCase() === subject.toLowerCase());
    if (existing) return { ok: false, error: "This subject already exists." };

    setCustomSubjects((current) => [...current, subject]);
    return { ok: true, subject };
  };

  const categories = ["All", ...CATEGORIES.slice(1), ...customSubjects];

  return (
    <SubjectContext.Provider value={{ categories, customSubjects, addSubject }}>
      {children}
    </SubjectContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectContext);
  if (!context) throw new Error("useSubjects must be inside SubjectProvider");
  return context;
}
