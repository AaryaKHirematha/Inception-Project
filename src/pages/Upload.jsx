import { useState, useRef } from "react";
import SHA256 from "crypto-js/sha256";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, File, X, Loader2, Link as LinkIcon, Hash } from "lucide-react";
import { useGlobal } from "../context/GlobalContext";
import { useToast } from "../context/ToastContext";

/* ── Helpers ────────────────────────────────────────────────────── */

const fmt = (b) =>
  b < 1024
    ? b + " B"
    : b < 1048576
    ? (b / 1024).toFixed(1) + " KB"
    : (b / 1048576).toFixed(1) + " MB";

/* ── Upload Page ───────────────────────────────────────────────── */

export default function Upload() {
  const { user, uploadEvidence } = useGlobal();
  const { addToast } = useToast();

  const [dragging, setDragging]   = useState(false);
  const [files, setFiles]         = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone]           = useState(false);
  const [caseRef, setCaseRef]     = useState("");
  const [category, setCategory]   = useState("");
  const inputRef = useRef();

  /* ── Role Gate ──────────────────────────────────────────────── */

  if (user?.role !== "admin") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-[13px] font-medium flex items-center gap-3"
      >
        <X className="w-5 h-5 text-rose-500" />
        Access Denied — Only court officials can upload evidence.
      </motion.div>
    );
  }

  /* ── File Handling ──────────────────────────────────────────── */

  const addFiles = (list) =>
    setFiles((prev) => [
      ...prev,
      ...Array.from(list).map((f) => {
        const id = Math.random().toString(36).slice(2);
        const fileObj = { file: f, id, hash: "Calculating…", isCalculating: true };

        const reader = new FileReader();
        reader.onload = () => {
          const hash = SHA256(reader.result).toString();
          setFiles((p) => p.map((item) => (item.id === id ? { ...item, hash, isCalculating: false } : item)));
        };
        reader.readAsBinaryString(f);

        return fileObj;
      }),
    ]);

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  /* ── Upload ─────────────────────────────────────────────────── */

  const handleUpload = async () => {
    if (!files.length || !caseRef) {
      addToast("Please provide a case reference.", "error");
      return;
    }
    setUploading(true);

    try {
      for (const f of files) {
        await uploadEvidence({
          fileName: f.file.name,
          fileSize: fmt(f.file.size),
          hash: f.hash,
          caseRef,
          category,
        });
      }
      setDone(true);
      addToast("Evidence successfully anchored to blockchain", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to upload evidence", "error");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setDone(false);
    setCaseRef("");
    setCategory("");
  };

  /* ── Success Screen ─────────────────────────────────────────── */

  if (done) {
    return (
      <div className="max-w-[540px] mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400 rounded-full blur-3xl opacity-10" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-400 rounded-full blur-3xl opacity-10" />

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={2} />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Evidence Anchored</h2>
          <p className="text-slate-500 text-sm mb-8">
            The cryptographic hashes have been securely recorded on the blockchain.
          </p>

          {/* Hash receipts */}
          <div className="space-y-3 mb-8">
            {files.map((f, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                key={f.id} 
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-left hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-2 text-[14px] font-semibold text-slate-800 mb-1">
                  <File className="w-4 h-4 text-indigo-500" />
                  {f.file.name}
                </div>
                <div className="flex items-start gap-1.5 text-[11.5px] text-slate-500 mt-2 bg-slate-100/80 p-2 rounded-lg font-mono break-all">
                  <Hash className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                  <span>{f.hash}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <button onClick={reset} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-[14px] font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer inline-flex items-center gap-2">
            Upload More Evidence
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── Main Form ──────────────────────────────────────────────── */

  return (
    <div className="max-w-[720px] mx-auto flex flex-col gap-6 py-4">

      {/* Case Information */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-7"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <LinkIcon size={20} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-800">Case Information</h3>
            <p className="text-xs text-slate-400 font-medium">Link this evidence to a specific legal proceeding</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Case Reference <span className="text-indigo-500">*</span>
            </label>
            <input
              value={caseRef}
              placeholder="e.g. CASE-2025-089A"
              onChange={(e) => setCaseRef(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 bg-slate-50/50 text-sm font-medium outline-none placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:ring-[4px] focus:ring-indigo-500/10 focus:bg-white hover:border-indigo-300"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Category
            </label>
            <input
              value={category}
              placeholder="e.g. Documentary Evidence"
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-slate-200 bg-slate-50/50 text-sm font-medium outline-none placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:ring-[4px] focus:ring-indigo-500/10 focus:bg-white hover:border-indigo-300"
            />
          </div>
        </div>
      </motion.div>

      {/* Hidden file input */}
      <input
        type="file"
        multiple
        ref={inputRef}
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* Drop zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden border-[2px] border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ease-out group ${
          dragging
            ? "border-indigo-500 bg-indigo-50/80 scale-[1.01]"
            : "border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50/50"
        }`}
      >
        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 transition-colors duration-300 ${dragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
          <UploadCloud size={32} strokeWidth={1.5} />
        </div>
        <h4 className={`text-base font-bold mb-1 transition-colors ${dragging ? 'text-indigo-700' : 'text-slate-700'}`}>
          {dragging ? 'Drop evidence files here' : 'Select files to anchor'}
        </h4>
        <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">
          Drag and drop documents, images, or media files here, or click to browse your computer.
        </p>
      </motion.div>

      {/* File list */}
      {files.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-col gap-3"
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 px-1 flex justify-between">
            <span>Files to Anchor ({files.length})</span>
          </div>
          
          <AnimatePresence>
            {files.map((f) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                key={f.id} 
                className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] px-5 py-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-slate-800 truncate mb-1">{f.file.name}</div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                    <span>{fmt(f.file.size)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {f.isCalculating ? (
                      <span className="flex items-center gap-1.5 text-amber-500">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Generating Hash...
                      </span>
                    ) : (
                      <span className="font-mono text-slate-500 truncate" title={f.hash}>
                        {f.hash.slice(0, 24)}…
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleUpload}
          disabled={uploading || !caseRef || files.some(f => f.isCalculating)}
          className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-[15px] font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Anchoring on Blockchain…
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              Anchor {files.length} {files.length === 1 ? 'File' : 'Files'}
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}