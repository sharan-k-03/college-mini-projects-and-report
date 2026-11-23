import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UploadModal from "../components/UploadModal";
import { useAuth } from "../context/AuthContext";
import { Upload, LogIn } from "lucide-react";

export default function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  if (!user) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#dcd8cf] bg-[#eee8d5]">
          <Upload size={28} className="text-[#52665d]" />
        </div>
        <h1 className="text-3xl text-[#252724] dark:text-white">Share a lecture</h1>
        <p className="max-w-sm text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          Create an account or sign in to share your study videos with the community.
        </p>
        <button
          onClick={() => navigate("/login", { state: { mode: "signin", returnTo: location.pathname } })}
          className="flex min-h-11 items-center gap-2 rounded-full bg-[#20372f] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2f4a40]"
        >
          <LogIn size={16} /> Sign in to upload
        </button>
      </div>
    );
  }

  return (
    <>
      {open && <UploadModal onClose={() => setOpen(false)} />}
      {!open && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-gray-500 dark:text-gray-400">Upload cancelled.</p>
          <button onClick={() => setOpen(true)} className="min-h-11 rounded-full bg-[#20372f] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2f4a40]">
            Open upload again
          </button>
        </div>
      )}
    </>
  );
}
