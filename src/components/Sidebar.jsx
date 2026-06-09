import { useState } from "react";
import { useGlobal } from "../context/GlobalContext";

/* ── Nav Items ──────────────────────────────────────────────────── */

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: "upload",
    label: "Upload Evidence",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    id: "verify",
    label: "Verify Document",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    id: "logs",
    label: "Audit Logs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
];

/* ── Nav Button ─────────────────────────────────────────────────── */

function NavBtn({ item, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-left transition-all outline-none cursor-pointer
        ${isActive
          ? "bg-indigo-500/15 text-indigo-300"
          : "text-white/45 hover:bg-white/[0.06] hover:text-white/75"
        }`}
    >
      <span className={`shrink-0 flex ${isActive ? "text-indigo-400" : "text-white/30"}`}>
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
      )}
    </button>
  );
}

/* ── Sign Out Button ────────────────────────────────────────────── */

function SignOutBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-left text-white/30 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
      Sign Out
    </button>
  );
}

/* ── Sidebar ───────────────────────────────────────────────────── */

export default function Sidebar() {
  const { activePage, setActivePage, logout, user } = useGlobal();

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen flex flex-col z-30 bg-gradient-to-b from-slate-900 to-gray-900 border-r border-white/[0.06]">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06] flex items-center gap-2.5">
        <div className="w-[30px] h-[30px] rounded-lg shrink-0 bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(79,70,229,0.35)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <div>
          <div className="text-[15px] text-slate-50 tracking-tight font-serif">LEGAL E-VAULT</div>
          <div className="text-[10px] text-white/30 uppercase tracking-[0.12em] font-medium mt-px">Legal Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <span className="block text-[10px] font-semibold text-white/20 uppercase tracking-[0.12em] px-2 mb-2">
          Navigation
        </span>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavBtn
              key={item.id}
              item={item}
              isActive={activePage === item.id}
              onClick={() => setActivePage(item.id)}
            />
          ))}
        </div>

        <div className="h-px bg-white/[0.06] mx-2 my-4" />

        <NavBtn
          item={{
            id: "__help",
            label: "Help & Documentation",
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            ),
          }}
          isActive={false}
          onClick={() => {}}
        />
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] bg-white/5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {user?.avatar || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-slate-100 truncate">
              {user?.name || "User"}
            </div>
            <div className="text-[11px] text-white/30 mt-px truncate capitalize">
              {user?.role || "Member"}
            </div>
          </div>
        </div>
        <SignOutBtn onClick={logout} />
      </div>
    </aside>
  );
}
