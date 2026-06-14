import { useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Login     from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload    from "./pages/Upload";
import Verify    from "./pages/Verify";
import Logs      from "./pages/Logs";
import Sidebar   from "./components/Sidebar";
import Header    from "./components/Header";
import GlobalProvider, { useGlobal } from "./context/GlobalContext";

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

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-64 min-h-screen">
        <Header />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto animate-page-enter">
            {pages[activePage] || pages.dashboard}
          </div>
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
      <AppShell />
      <SpeedInsights />
    </GlobalProvider>
  );
}
