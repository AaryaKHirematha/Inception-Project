import { useState, useRef } from "react";
import SHA256 from "crypto-js/sha256";
import { useGlobal } from "../context/GlobalContext";

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
      <div className="px-6 py-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[13px]">
        Access Denied — Only court officials can upload evidence.
      </div>
    );
  }

  /* ── File Handling ──────────────────────────────────────────── */

  const addFiles = (list) =>
    setFiles((prev) => [
      ...prev,
      ...Array.from(list).map((f) => {
        const id = Math.random().toString(36).slice(2);
        const fileObj = { file: f, id, hash: "Calculating…" };

        const reader = new FileReader();
        reader.onload = () => {
          const hash = SHA256(reader.result).toString();
          setFiles((p) => p.map((item) => (item.id === id ? { ...item, hash } : item)));
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
    if (!files.length || !caseRef) return;
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
    } catch (err) {
      console.error(err);
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
      <div className="max-w-[480px] mx-auto">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.75">
              <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-xl font-semibold mb-4">Evidence Anchored</div>

          {/* Hash receipts */}
          {files.map((f) => (
            <div key={f.id} className="mt-3 p-3 rounded-[10px] border border-slate-200 bg-white text-left">
              <div className="text-[13px] font-medium">{f.file.name}</div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono break-all">Hash: {f.hash}</div>
            </div>
          ))}

          <button onClick={reset} className="mt-6 px-5 py-2.5 rounded-[10px] bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-[13px] font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
            Upload More Evidence
          </button>
        </div>
      </div>
    );
  }

  /* ── Main Form ──────────────────────────────────────────────── */

  return (
    <div className="max-w-[720px] mx-auto flex flex-col gap-4">

      {/* Case Information */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="mb-4">
          <div className="text-sm font-semibold text-slate-800">Case Information</div>
          <div className="text-xs text-slate-400 mt-0.5">Required before uploading evidence files</div>
        </div>

        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Case Reference <span className="text-indigo-500">*</span>
        </label>
        <input
          value={caseRef}
          placeholder="CASE-XXXX"
          onChange={(e) => setCaseRef(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-slate-200 bg-slate-50 text-sm outline-none placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 focus:bg-white hover:border-indigo-300"
        />

        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 mt-4">
          Category
        </label>
        <input
          value={category}
          placeholder="e.g. Documentary Evidence"
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-slate-200 bg-slate-50 text-sm outline-none placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:ring-[3px] focus:ring-indigo-500/10 focus:bg-white hover:border-indigo-300"
        />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        multiple
        ref={inputRef}
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-indigo-400 bg-indigo-50/50"
            : "border-slate-200 hover:border-indigo-300"
        }`}
      >
        <div className="text-2xl mb-2">📂</div>
        <div className="text-sm text-slate-500">Drag &amp; Drop Files or click to browse</div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 bg-white rounded-[10px] border border-slate-100 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{f.file.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{fmt(f.file.size)} · <span className="font-mono">{f.hash.slice(0, 16)}…</span></div>
              </div>
              <button onClick={() => removeFile(f.id)} className="text-slate-400 hover:text-rose-500 transition-colors text-lg leading-none cursor-pointer">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading || !caseRef}
          className="w-full py-3 rounded-[10px] bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {uploading ? "Anchoring on Blockchain…" : "Upload & Anchor"}
        </button>
      )}
    </div>
  );
}