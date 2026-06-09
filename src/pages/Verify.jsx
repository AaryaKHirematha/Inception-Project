import { useState } from "react";
import { useGlobal } from "../context/GlobalContext";

/* ── Detail Row ─────────────────────────────────────────────────── */

function DetailRow({ label, value, mono }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </div>
      <div className={`text-[13px] font-medium text-slate-800 break-all ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}

/* ── Verify Page ───────────────────────────────────────────────── */

export default function Verify() {
  const { user, verifyHash } = useGlobal();

  const [hash, setHash]           = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult]       = useState(null);
  const [notFound, setNotFound]   = useState(false);

  const doVerify = async () => {
    if (!hash.trim()) return;
    setVerifying(true);
    setResult(null);
    setNotFound(false);

    try {
      const rec = await verifyHash(hash.trim());
      if (rec) {
        setResult(rec);
      } else {
        setNotFound(true);
      }
    } finally {
      setVerifying(false);
    }
  };

  const fillDemo = () => {
    setHash("0x4f3a9c1b7e8d2f5a0b6e3c9d1f4a7b2e8c5d9f3a");
    setResult(null);
    setNotFound(false);
  };

  return (
    <div className="max-w-[640px] mx-auto flex flex-col gap-4">

      {/* Hash input card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="mb-4">
          <div className="text-sm font-semibold text-slate-800">Verify by Blockchain Hash</div>
          <div className="text-xs text-slate-400 mt-0.5">
            Paste an evidence hash to query its immutable blockchain record.
          </div>
        </div>

        <div className="flex gap-2.5">
          <input
            value={hash}
            placeholder="0x4f3a9c1b7e8d2f5a0b6e3c9d…"
            onChange={(e) => { setHash(e.target.value); setResult(null); setNotFound(false); }}
            onKeyDown={(e) => e.key === "Enter" && doVerify()}
            className="flex-1 px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-slate-200 bg-slate-50 text-[13px] font-mono outline-none placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 focus:bg-white hover:border-indigo-300"
          />
          <button
            onClick={doVerify}
            disabled={verifying || !hash.trim()}
            className="px-4 py-2.5 rounded-[10px] bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-[13px] font-semibold whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {verifying ? "Querying Chain…" : "Verify Hash"}
          </button>
        </div>

        {/* Demo fill button */}
        <button
          onClick={fillDemo}
          className="mt-3 text-[11px] text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          Try demo hash →
        </button>
      </div>

      {/* Result: Full access */}
      {result && !result.restricted && (
        <div className="bg-white rounded-xl border border-emerald-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Document Verified</span>
          </div>
          <DetailRow label="Evidence ID"       value={result.id} />
          <DetailRow label="Case Reference"    value={result.caseRef} />
          <DetailRow label="File Name"         value={result.name} />
          <DetailRow label="Uploaded By"       value={result.uploadedBy} />
          <DetailRow label="Transaction Hash"  value={result.hash} mono />
          {result.blockNumber && (
            <DetailRow label="Block Number" value={`#${result.blockNumber.toLocaleString()}`} mono />
          )}
        </div>
      )}

      {/* Result: Restricted */}
      {result && result.restricted && (
        <div className="px-5 py-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[13px]">
          <strong>Restricted:</strong> A record matching this hash exists ({result.id}, {result.caseRef}), but your role does not permit viewing full details.
        </div>
      )}

      {/* Not found */}
      {notFound && (
        <div className="px-4 py-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[13px]">
          No Blockchain Record Found
        </div>
      )}
    </div>
  );
}