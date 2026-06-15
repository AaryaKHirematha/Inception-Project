import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, RefreshCw, XCircle, CheckCircle, ScrollText, AlertTriangle } from "lucide-react";
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
    <span className={`inline-flex items-center text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md border tracking-wide ${map[action] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
      {label}
    </span>
  );
}

/* ── Status dot ─────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${status === "success" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
      {status === "success" ? <CheckCircle size={14} /> : <XCircle size={14} />}
    </span>
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
    const matchQ = !q || [log.user, log.file, log.id, log.caseRef].some((s) => s?.toLowerCase().includes(q));
    const matchF = filter === "all" || log.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="flex flex-col gap-6">

      {/* Public warning */}
      {user?.role === "public" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3 font-medium"
        >
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          Access Denied — Logs are restricted to authorized personnel.
        </motion.div>
      )}

      {/* Controls Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs by user, file, case..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-[1.5px] border-slate-200 bg-slate-50 text-[13px] font-medium outline-none placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 focus:bg-white"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {["all", "success", "failure"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  filter === f
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <button 
            onClick={refreshLogs}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors ml-auto sm:ml-2 shrink-0 cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw size={18} className={loadingLogs ? "animate-spin" : ""} />
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]"
      >
        {loadingLogs && logsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={24} className="text-indigo-500 animate-spin" />
            <div className="text-sm font-medium text-slate-400">Loading immutable logs...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <ScrollText size={28} className="text-slate-300" />
            </div>
            <h4 className="text-[15px] font-semibold text-slate-700 mb-1">
              {logsList.length === 0 ? "No Logs Available" : "No Matches Found"}
            </h4>
            <p className="text-sm text-slate-500 max-w-[280px]">
              {logsList.length === 0 
                ? "There are currently no logs available for your role." 
                : "No log entries match your current search and filter criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">#</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">Action</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">User</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">File</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px]">Case</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px] text-center">Status</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[11px] text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={log.id} 
                    className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">{log.id}</td>
                    <td className="px-5 py-4"><ActionBadge action={log.action} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50 flex items-center justify-center text-[11px] font-bold text-indigo-600 shrink-0 shadow-sm">
                          {log.init}
                        </span>
                        <span className="font-semibold text-slate-700">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-medium max-w-[180px] truncate" title={log.file}>
                      {log.file || "—"}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {log.caseRef ? (
                        <span className="bg-slate-100/50 px-2 py-1 rounded border border-slate-200/50">{log.caseRef}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-500 text-right whitespace-nowrap">
                      {new Date(log.ts).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}