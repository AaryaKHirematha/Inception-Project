import { useEffect } from "react";
import { useGlobal } from "../context/GlobalContext";

/* ── Stat card ──────────────────────────────────────────────────── */

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </div>
      <div className={`text-2xl font-bold ${accent ? "text-rose-600" : "text-slate-800"}`}>
        {value}
      </div>
    </div>
  );
}

/* ── Status badge ───────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const map = {
    Verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending:  "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${map[status] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
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
    <div className="flex flex-col gap-4">

      {/* Public warning */}
      {user?.role === "public" && (
        <div className="px-3 py-2.5 rounded-[10px] bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          Limited Access: Only case summaries are visible.
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Evidence"  value={totalCount} />
        <StatCard label="Verified"        value={verifiedCount} />
        <StatCard label="Pending"         value={pendingCount} accent={pendingCount > 0} />
      </div>

      {/* Evidence table */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Evidence Records</h3>

        {loadingEvidence ? (
          <div className="text-center py-8 text-sm text-slate-400">Loading…</div>
        ) : evidenceList.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">No evidence records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="pb-2 font-semibold">ID</th>
                  <th className="pb-2 font-semibold">File</th>
                  <th className="pb-2 font-semibold">Hash</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Size</th>
                  <th className="pb-2 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {evidenceList.map((row) => (
                  <tr key={row.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 font-medium text-slate-700">{row.id}</td>
                    <td className="py-2.5 text-slate-700">{row.name}</td>
                    <td className="py-2.5 font-mono text-xs text-slate-500">
                      {row.hash ? `${row.hash.slice(0, 10)}…` : "—"}
                    </td>
                    <td className="py-2.5"><StatusBadge status={row.status} /></td>
                    <td className="py-2.5 text-slate-500">{row.size}</td>
                    <td className="py-2.5 text-slate-500">{row.time}</td>
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