import { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { VideoProvider } from "./context/VideoContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import UploadPage from "./pages/Upload";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("sea_of_learning_theme");
    return saved ? saved === "dark" : false;
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("sea_of_learning_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#f6f4ee] text-[#252724] transition-colors dark:bg-[#11110f] dark:text-neutral-100">
        <AuthProvider>
          <VideoProvider>
            <HashRouter>
              <Navbar
                query={query}
                setQuery={setQuery}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <main>
                <Routes>
                  <Route path="/" element={<Home query={query} setQuery={setQuery} />} />
                  <Route path="/watch/:id" element={<Watch />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </HashRouter>
          </VideoProvider>
        </AuthProvider>
      </div>
    </div>
  );
}
