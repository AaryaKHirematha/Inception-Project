import { useState, useEffect } from "react";
import { useGlobal } from "../context/GlobalContext";

/* ── Action badge ───────────────────────────────────────────────── */

function ActionBadge({ action }) {
  const map = {
    EVIDENCE_UPLOADED:  "bg-indigo-50 text-indigo-600 border-indigo-100",
    DOCUMENT_VERIFIED:  "bg-emerald-50 text-emerald-600 border-emerald-100",
    DOCUMENT_ACCESSED:  "bg-sky-50 text-sky-600 border-sky-100",
    LOGIN_ATTEMPT:      "bg-rose-50 text-rose-600 border-rose-100",
    CHAIN_SYNC:         "bg-slate-50 text-slate-500 border-slate-100",
  };
  const label = action.replace(/_/g, " ");
  return (
    <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${map[action] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
      {label}
    </span>
  );
}

/* ── Status dot ─────────────────────────────────────────────────── */

function StatusDot({ status }) {
  return (
    <span className={`w-1.5 h-1.5 rounded-full inline-block ${status === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
  );
}

/* ── Logs Page ─────────────────────────────────────────────────── */

export default function Logs() {
  const { user, logsList, loadingLogs, refreshLogs } = useGlobal();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  /* Client-side search + status filter (data is already role-filtered from API) */
  const filtered = logsList.filter((log) => {
    const q = search.toLowerCase();
    const matchQ = !q || [log.user, log.file, log.id, log.caseRef].some((s) => s.toLowerCase().includes(q));
    const matchF = filter === "all" || log.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="flex flex-col gap-4">

      {/* Public warning */}
      {user?.role === "public" && (
        <div className="px-3 py-2.5 rounded-[10px] bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          Access Denied — Logs are restricted to authorized personnel.
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search logs…"
          className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-[13px] outline-none placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 focus:bg-white"
        />
        {["all", "success", "failure"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              filter === f
                ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        {loadingLogs ? (
          <div className="text-center py-8 text-sm text-slate-400">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            {logsList.length === 0 ? "No logs available for your role." : "No logs match your filters."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="px-4 py-2.5 font-semibold">#</th>
                  <th className="px-4 py-2.5 font-semibold">Action</th>
                  <th className="px-4 py-2.5 font-semibold">User</th>
                  <th className="px-4 py-2.5 font-semibold">File</th>
                  <th className="px-4 py-2.5 font-semibold">Case</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-400">{log.id}</td>
                    <td className="px-4 py-2.5"><ActionBadge action={log.action} /></td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                          {log.init}
                        </span>
                        <span className="text-slate-700">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 max-w-[180px] truncate">{log.file}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{log.caseRef}</td>
                    <td className="px-4 py-2.5"><StatusDot status={log.status} /></td>
                    <td className="px-4 py-2.5 text-xs text-slate-400">{new Date(log.ts).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}