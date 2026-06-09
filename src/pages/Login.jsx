import { useState } from "react";
import { useGlobal } from "../context/GlobalContext";

/* ── Inline SVG Icons ──────────────────────────────────────────── */

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

/* ── Reusable input component ──────────────────────────────────── */

function FormInput({ label, type = "text", value, onChange, placeholder, id }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-slate-600 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && showPw ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={isPassword ? "current-password" : undefined}
          className="w-full px-3.5 py-2.5 rounded-[12px] border border-slate-200 bg-white text-[14px] text-slate-800 outline-none placeholder:text-slate-350 transition-all duration-200 focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/8 hover:border-slate-300"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPw ? <EyeOpen /> : <EyeClosed />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main Login Page ───────────────────────────────────────────── */

export default function Login() {
  const { login, signup, googleLogin } = useGlobal();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"

  /* Form state */
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [role, setRole]         = useState("admin");

  const [loading, setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]         = useState("");

  const switchMode = (m) => {
    setMode(m);
    setError("");
  };

  /* ── Handlers ──────────────────────────────────────────────── */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!name.trim()) { setError("What should we call you?"); return; }
      if (!email)        { setError("We'll need your email."); return; }
      if (!password)     { setError("Pick a password."); return; }
      if (password.length < 6) { setError("Password needs at least 6 characters."); return; }
      if (password !== confirm) { setError("Passwords don't match."); return; }
    } else {
      if (!email)    { setError("Enter your email to continue."); return; }
      if (!password) { setError("Enter your password."); return; }
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(name.trim(), email, password, role);
      } else {
        await login(email, password, role);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await googleLogin();
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const isSignUp = mode === "signup";

  /* ── Render ────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F7F5]">

      {/* ─── Left: Hero Panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex-col justify-between p-10 xl:p-14">

        {/* Organic floating shapes */}
        <div className="absolute top-[-80px] right-[-60px] w-[280px] h-[280px] rounded-full bg-indigo-600/10 blur-3xl login-float" />
        <div className="absolute bottom-[-100px] left-[-40px] w-[320px] h-[320px] rounded-full bg-violet-500/8 blur-3xl login-float-slow" />
        <div className="absolute top-[40%] left-[20%] w-[180px] h-[180px] rounded-full bg-blue-500/6 blur-2xl login-float-reverse" />

        {/* Subtle dot grid overlay */}
        <div className="absolute inset-0 login-dot-grid opacity-[0.03]" />

        {/* Top — Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <ShieldIcon />
            </div>
            <div>
              <span className="text-white/90 font-serif text-lg tracking-tight">Legal E-Vault</span>
            </div>
          </div>

          <h1 className="text-white text-[2.6rem] xl:text-[3rem] leading-[1.12] font-serif tracking-tight max-w-md">
            Evidence you can{" "}
            <span className="text-indigo-400">trust.</span>
          </h1>
          <p className="text-white/40 text-[15px] leading-relaxed mt-5 max-w-sm">
            Blockchain-secured document management for legal professionals. Every file hashed, every action logged, nothing tampered.
          </p>
        </div>

        {/* Bottom — Platform features (honest, no fake stats) */}
        <div className="relative z-10">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white/80">SHA-256 File Hashing</div>
                <div className="text-[11px] text-white/30 mt-0.5 leading-relaxed">Every document is hashed client-side before upload</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white/80">Immutable Audit Trail</div>
                <div className="text-[11px] text-white/30 mt-0.5 leading-relaxed">Every action is logged — uploads, verifications, access</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white/80">Role-Based Access</div>
                <div className="text-[11px] text-white/30 mt-0.5 leading-relaxed">Officials, participants & public — each see only what they should</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <span className="text-[11px] text-white/20">
              Open-source evidence management · Built for transparency
            </span>
          </div>
        </div>
      </div>

      {/* ─── Right: Form Panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo (hidden on desktop) */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white">
              <ShieldIcon />
            </div>
            <span className="text-slate-800 font-serif text-[17px] tracking-tight">Legal E-Vault</span>
          </div>

          {/* Greeting */}
          <div className="mb-7">
            <h2 className="text-[26px] font-serif text-slate-900 tracking-tight leading-tight">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-slate-400 text-[14px] mt-1.5 leading-relaxed">
              {isSignUp
                ? "Set up your workspace in under a minute."
                : "Sign in to continue to your evidence vault."}
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-[12px] border border-slate-200 bg-white text-[14px] font-medium text-slate-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-slate-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            <GoogleLogo />
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[12px] text-slate-400 select-none">or use email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Error message */}
          {error && (
            <div className="px-3.5 py-2.5 mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] leading-snug">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

            {isSignUp && (
              <FormInput
                id="signup-name"
                label="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arya Hiremath"
              />
            )}

            <FormInput
              id="auth-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <FormInput
              id="auth-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? "Min 6 characters" : "••••••••"}
            />

            {isSignUp && (
              <FormInput
                id="auth-confirm"
                label="Confirm password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Type it again"
              />
            )}

            <div>
              <label className="block text-[13px] font-medium text-slate-600 mb-1.5">
                Access Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[12px] border border-slate-200 bg-white text-[14px] text-slate-800 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/8 hover:border-slate-300 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em"
                }}
              >
                <option value="admin">Court Official</option>
                <option value="user">Case Participant</option>
                <option value="public">Public Viewer</option>
              </select>
            </div>

            {/* Forgot password (sign-in only) */}
            {!isSignUp && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  className="text-[12px] text-indigo-500 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-2.5 mt-1 rounded-[12px] bg-slate-900 text-white text-[14px] font-semibold shadow-sm hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              {loading
                ? (isSignUp ? "Creating account…" : "Signing in…")
                : (isSignUp ? "Create account" : "Sign in")}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-[13px] text-slate-400 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isSignUp ? "signin" : "signup")}
              className="text-indigo-500 hover:text-indigo-700 font-semibold transition-colors cursor-pointer"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>

          {/* Footer trust badge */}
          <div className="flex items-center justify-center gap-1.5 mt-8 pt-6 border-t border-slate-100">
            <span className="text-slate-300">
              <LockIcon />
            </span>
            <span className="text-[11px] text-slate-350">
              Protected by 256-bit encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}