import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Login     from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload    from "./pages/Upload";
import Verify    from "./pages/Verify";
import Logs      from "./pages/Logs";
import Sidebar   from "./components/Sidebar";
import Header    from "./components/Header";
import GlobalProvider, { useGlobal } from "./context/GlobalContext";
import { ToastProvider } from "./context/ToastContext";

/* ── Inner App (has access to context) ──────────────────────────── */

function AppShell() {
  const { isAuthenticated, activePage, user } = useGlobal();

  /* Login owns its own full-page layout */
  if (!isAuthenticated) return <Login />;

  const pages = {
    dashboard: <Dashboard key="d" />,
    upload:    <Upload    key="u" />,
    verify:    <Verify    key="v" />,
    logs:      <Logs      key="l" />,
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-64 min-h-screen">
        <Header />

        <main className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[1200px] mx-auto"
            >
              {pages[activePage] || pages.dashboard}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-8 py-3.5 border-t border-slate-200/50 bg-white/50">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              © 2025 EvidenceVault · Blockchain-Secured Legal Evidence Management
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[11px] text-slate-400">All systems operational</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ── Root App (wraps in provider) ───────────────────────────────── */

export default function App() {
  return (
    <GlobalProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </GlobalProvider>
  );
}
