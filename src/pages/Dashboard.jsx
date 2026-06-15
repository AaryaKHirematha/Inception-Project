import { useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock, Loader2, Database } from "lucide-react";
import { useGlobal } from "../context/GlobalContext";

/* ── Stat card ──────────────────────────────────────────────────── */

function StatCard({ label, value, accent, icon: Icon, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </div>
        {Icon && (
          <div className={`p-2 rounded-xl ${accent ? "bg-amber-50 text-amber-500" : "bg-indigo-50 text-indigo-500"}`}>
            <Icon size={16} strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <div className={`text-3xl font-bold ${accent ? "text-amber-600" : "text-slate-800"}`}>
          {value}
        </div>
      </div>
      
      {/* Decorative gradient blob */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${accent ? "bg-amber-400" : "bg-indigo-400"}`} />
    </motion.div>
  );
}

/* ── Status badge ───────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const map = {
    Verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending:  "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border ${map[status] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
      {status}
    </span>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────── */

export default function Dashboard() {
  const { user, evidenceList, loadingEvidence, refreshEvidence } = useGlobal();

  useEffect(() => {
    refreshEvidence();
  }, [refreshEvidence]);

  const totalCount  = evidenceList.length;
  const pendingCount = evidenceList.filter((e) => e.status === "Pending").length;
  const verifiedCount = evidenceList.filter((e) => e.status === "Verified").length;

  return (
    <div className="flex flex-col gap-6">

      {/* Public warning */}
      {user?.role === "public" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2 font-medium"
        >
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          Limited Access: Only case summaries are visible.
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard label="Total Evidence" value={totalCount} icon={FileText} delay={0.1} />
        <StatCard label="Verified" value={verifiedCount} icon={CheckCircle} delay={0.2} />
        <StatCard label="Pending" value={pendingCount} accent={pendingCount > 0} icon={Clock} delay={0.3} />
      </div>

      {/* Evidence table */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[15px] font-bold text-slate-800">Recent Evidence Records</h3>
          <button 
            onClick={refreshEvidence}
            className="text-[12px] font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {loadingEvidence ? <Loader2 size={14} className="animate-spin" /> : "Refresh"}
          </button>
        </div>

        {loadingEvidence && evidenceList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 size={24} className="text-indigo-500 animate-spin" />
            <div className="text-sm text-slate-400 font-medium">Fetching secure records...</div>
          </div>
        ) : evidenceList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Database size={28} className="text-slate-300" />
            </div>
            <h4 className="text-[15px] font-semibold text-slate-700 mb-1">No evidence found</h4>
            <p className="text-sm text-slate-500 max-w-[250px]">
              Upload new evidence to the vault to see it appear here in the ledger.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-semibold px-2">ID</th>
                  <th className="pb-3 font-semibold px-2">File Name</th>
                  <th className="pb-3 font-semibold px-2">Blockchain Hash</th>
                  <th className="pb-3 font-semibold px-2">Status</th>
                  <th className="pb-3 font-semibold px-2 text-right">Size</th>
                </tr>
              </thead>
              <tbody>
                {evidenceList.map((row, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    key={row.id} 
                    className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-2 font-medium text-slate-700">{row.id}</td>
                    <td className="py-3.5 px-2 text-slate-700 font-medium group-hover:text-indigo-600 transition-colors">{row.name}</td>
                    <td className="py-3.5 px-2 font-mono text-xs text-slate-400">
                      <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        {row.hash ? `${row.hash.slice(0, 16)}…` : "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-2"><StatusBadge status={row.status} /></td>
                    <td className="py-3.5 px-2 text-slate-500 text-right">{row.size}</td>
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