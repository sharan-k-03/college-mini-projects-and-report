import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowRight, BookOpen, LockKeyhole, Mail, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode || "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    setError("");

    if (mode === "register" && name.trim().length < 2) {
      setError("Enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    login({
      name: mode === "register" ? name : name || email.split("@")[0],
      email,
    });
    navigate(location.state?.returnTo || "/", { replace: true });
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-[1fr_420px]">
      <section className="hidden lg:block">
        <div className="max-w-lg border-l border-[#d7c99d] pl-8">
          <BookOpen className="mb-6 text-[#52665d]" size={28} />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52665d]">sea_of_learning</p>
          <h1 className="mt-4 text-5xl leading-[1.05] text-[#252724]">
            Learn with intention.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-neutral-600">
            Save lectures, follow your progress, and keep your place across subjects.
          </p>
        </div>
      </section>

      <section className="w-full max-w-md justify-self-center rounded-2xl border border-[#dcd8cf] bg-[#faf9f6] p-6 shadow-[0_24px_70px_rgba(38,48,42,.10)] dark:border-white/10 dark:bg-[#181817] sm:p-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#52665d] dark:text-[#b7c2b7]">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </p>
            <h2 className="mt-1 text-3xl text-[#252724] dark:text-white">
              {mode === "signin" ? "Sign in" : "Register"}
            </h2>
          </div>
          <LockKeyhole className="text-[#52665d]" size={22} />
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-lg border border-[#dcd8cf] p-1 dark:border-white/10">
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(""); }}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "signin" ? "bg-[#2f4a40] text-white" : "text-neutral-500"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setError(""); }}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "register" ? "bg-[#2f4a40] text-white" : "text-neutral-500"}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Name</span>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-[#dcd8cf] bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#52665d] focus:ring-2 focus:ring-[#52665d]/20 dark:border-white/10 dark:bg-white/[.05]"
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#dcd8cf] bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#52665d] focus:ring-2 focus:ring-[#52665d]/20 dark:border-white/10 dark:bg-white/[.05]"
              />
            </div>
          </label>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2f4a40] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#20372f]"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
            <ArrowRight size={16} />
          </button>
        </form>

        <Link to="/" className="mt-5 block text-center text-xs font-semibold text-[#52665d] hover:underline dark:text-[#b7c2b7]">
          Continue browsing
        </Link>
      </section>
    </div>
  );
}
