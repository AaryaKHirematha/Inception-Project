import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, AlertTriangle, FileWarning, Loader2, Key } from "lucide-react";
import { useGlobal } from "../context/GlobalContext";
import { useToast } from "../context/ToastContext";

/* ── Detail Row ─────────────────────────────────────────────────── */

function DetailRow({ label, value, mono }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
        {label}
      </div>
      <div className={`text-[14px] font-medium text-slate-800 break-all ${mono ? "font-mono bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50" : ""}`}>
        {value}
      </div>
    </div>
  );
}

/* ── Verify Page ───────────────────────────────────────────────── */

export default function Verify() {
  const { user, verifyHash } = useGlobal();
  const { addToast } = useToast();

  const [hash, setHash]           = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult]       = useState(null);
  const [notFound, setNotFound]   = useState(false);

  const doVerify = async () => {
    if (!hash.trim()) {
      addToast("Please enter a hash to verify.", "error");
      return;
    }
    setVerifying(true);
    setResult(null);
    setNotFound(false);

    try {
      // Fake delay to show spinner
      await new Promise(r => setTimeout(r, 600));
      
      const rec = await verifyHash(hash.trim());
      if (rec) {
        setResult(rec);
        if (!rec.restricted) {
          addToast("Evidence successfully verified", "success");
        } else {
          addToast("Record found but access is restricted", "info");
        }
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
    <div className="max-w-[640px] mx-auto flex flex-col gap-6 py-4">

      {/* Hash input card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Key size={20} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-800">Verify by Blockchain Hash</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Paste an evidence hash to query its immutable ledger record.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              value={hash}
              placeholder="0x4f3a9c1b7e8d2f5a0b6e3c9d…"
              onChange={(e) => { setHash(e.target.value); setResult(null); setNotFound(false); }}
              onKeyDown={(e) => e.key === "Enter" && doVerify()}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border-[1.5px] border-slate-200 bg-slate-50/50 text-[14px] font-mono outline-none placeholder:text-slate-400 placeholder:font-sans transition-all focus:border-indigo-500 focus:ring-[4px] focus:ring-indigo-500/10 focus:bg-white hover:border-indigo-300"
            />
          </div>
          <button
            onClick={doVerify}
            disabled={verifying || !hash.trim()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-[14px] font-bold whitespace-nowrap shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Querying…
              </>
            ) : (
              "Verify Hash"
            )}
          </button>
        </div>

        {/* Demo fill button */}
        <button
          onClick={fillDemo}
          className="mt-4 text-[12px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer inline-flex items-center gap-1 bg-indigo-50/50 px-3 py-1.5 rounded-lg"
        >
          Try demo hash <span className="text-[10px]">→</span>
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Result: Full access */}
        {result && !result.restricted && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-2xl border border-emerald-200 shadow-[0_8px_30px_rgb(16,185,129,0.06)] p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-[14px] font-bold uppercase tracking-wider text-emerald-600">Document Verified</div>
                <div className="text-[12px] text-slate-500 font-medium">Cryptographic match found on ledger</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <DetailRow label="Evidence ID"       value={result.id} />
              <DetailRow label="Case Reference"    value={result.caseRef} />
              <DetailRow label="File Name"         value={result.name} />
              <DetailRow label="Uploaded By"       value={result.uploadedBy} />
              <div className="md:col-span-2">
                <DetailRow label="Transaction Hash"  value={result.hash} mono />
              </div>
              {result.blockNumber && (
                <div className="md:col-span-2">
                  <DetailRow label="Block Number" value={`#${result.blockNumber.toLocaleString()}`} mono />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Result: Restricted */}
        {result && result.restricted && (
          <motion.div 
            key="restricted"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="px-6 py-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm flex items-start gap-4"
          >
            <div className="mt-0.5 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
              <AlertTriangle size={18} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[14px] font-bold text-amber-800 mb-1">Restricted Access</div>
              <div className="text-[13px] text-amber-700/80 font-medium leading-relaxed">
                A valid record matching this hash exists (<span className="font-semibold">{result.id}</span>, <span className="font-semibold">{result.caseRef}</span>), but your current role level does not permit viewing full details.
              </div>
            </div>
          </motion.div>
        )}

        {/* Not found */}
        {notFound && (
          <motion.div 
            key="notfound"
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="px-6 py-6 rounded-2xl bg-rose-50 border border-rose-200 shadow-sm flex items-center gap-4 text-rose-700"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-500">
              <FileWarning size={24} strokeWidth={2} />
            </div>
            <div>
              <div className="text-[15px] font-bold mb-0.5">No Ledger Record Found</div>
              <div className="text-[13px] font-medium text-rose-600/80">
                This hash does not match any anchored evidence on the blockchain.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}