import { useState } from "react";
import UploadModal from "../components/UploadModal";
import { useAuth } from "../context/AuthContext";
import { Upload, LogIn } from "lucide-react";

export default function UploadPage() {
  const { user, login } = useAuth();
  const [open, setOpen] = useState(true);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
          <Upload size={28} className="text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign in to upload</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
          Create an account or sign in to share your study videos with the community.
        </p>
        <button
          onClick={login}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
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
          <button onClick={() => setOpen(true)} className="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
            Open upload again
          </button>
        </div>
      )}
    </>
  );
}
