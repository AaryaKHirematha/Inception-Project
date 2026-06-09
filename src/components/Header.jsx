import { useState } from "react";
import { useGlobal } from "../context/GlobalContext";

/* ── Page metadata ──────────────────────────────────────────────── */

const PAGE_META = {
  dashboard: { title: "Dashboard",       crumbs: ["Home", "Dashboard"],           desc: "Overview of your evidence vault" },
  upload:    { title: "Upload Evidence",  crumbs: ["Home", "Evidence", "Upload"],  desc: "Securely add new evidence to the blockchain" },
  verify:    { title: "Verify Document",  crumbs: ["Home", "Evidence", "Verify"],  desc: "Authenticate documents against blockchain records" },
  logs:      { title: "Audit Logs",       crumbs: ["Home", "System", "Audit Logs"], desc: "Immutable, tamper-evident activity record" },
};

/* ── Icons ──────────────────────────────────────────────────────── */

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

/* ── Header ────────────────────────────────────────────────────── */

export default function Header() {
  const { activePage, setActivePage } = useGlobal();
  const meta = PAGE_META[activePage] || PAGE_META.dashboard;

  return (
    <header className="sticky top-0 z-20 h-[60px] bg-slate-100/90 backdrop-blur-sm border-b border-slate-200/50 flex items-center px-8">

      {/* Left: breadcrumb + title */}
      <div className="flex-1 flex flex-col justify-center gap-0.5">
        <nav className="flex items-center gap-1">
          {meta.crumbs.map((c, i) => (
            <span key={c} className="flex items-center gap-1">
              {i > 0 && <ChevronRight />}
              <span className={`text-[11px] font-semibold tracking-tight ${
                i === meta.crumbs.length - 1 ? "text-indigo-500" : "text-slate-400"
              }`}>
                {c}
              </span>
            </span>
          ))}
        </nav>
        <div className="text-base font-semibold text-slate-900 tracking-tight leading-none font-serif">
          {meta.title}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">

        {/* Chain synced badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-xs font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Chain Synced
        </div>

        {/* Bell */}
        <button className="relative w-9 h-9 rounded-lg border border-slate-200 bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer">
          <BellIcon />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 border border-slate-100" />
        </button>

        {/* New Upload CTA */}
        <button
          onClick={() => setActivePage("upload")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-[13px] font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <PlusIcon />
          New Upload
        </button>
      </div>
    </header>
  );
}
