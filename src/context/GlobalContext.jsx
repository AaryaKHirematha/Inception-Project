import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api } from "../services/api";

/* ── Context ───────────────────────────────────────────────────── */

const GlobalContext = createContext(null);

export function useGlobal() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be inside <GlobalProvider>");
  return ctx;
}

/* ── Provider ──────────────────────────────────────────────────── */

export default function GlobalProvider({ children }) {
  /* Auth */
  const [user, setUser]                     = useState(null);
  const [isAuthenticated, setAuthenticated]  = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  /* Navigation */
  const [activePage, setActivePage] = useState("dashboard");

  /* Data */
  const [evidenceList, setEvidenceList] = useState([]);
  const [logsList, setLogsList]         = useState([]);

  /* Loading flags */
  const [loadingEvidence, setLoadingEvidence] = useState(false);
  const [loadingLogs, setLoadingLogs]         = useState(false);

  /* ── Auth Actions ─────────────────────────────────────────────── */

  const login = useCallback(async (email, password, role) => {
    const data = await api.login(email, password, role);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setAuthenticated(true);
    setActivePage("dashboard");
    return data.user;
  }, []);

  const signup = useCallback(async (name, email, password, role) => {
    const data = await api.signup(name, email, password, role);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setAuthenticated(true);
    setActivePage("dashboard");
    return data.user;
  }, []);

  const googleLogin = useCallback(async () => {
    const data = await api.googleLogin();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setAuthenticated(true);
    setActivePage("dashboard");
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthenticated(false);
    setEvidenceList([]);
    setLogsList([]);
    setActivePage("dashboard");
  }, []);

  /* ── Data Actions ─────────────────────────────────────────────── */

  const refreshEvidence = useCallback(async () => {
    if (!user) return;
    setLoadingEvidence(true);
    try {
      const data = await api.fetchEvidence();
      setEvidenceList(data);
    } finally {
      setLoadingEvidence(false);
    }
  }, [user]);

  const uploadEvidence = useCallback(async (payload) => {
    if (!user) return;
    const newRecord = await api.uploadEvidence(payload.fileName, payload.fileSize, payload.caseId);
    // Optimistic: prepend locally
    setEvidenceList((prev) => [newRecord, ...prev]);
    return newRecord;
  }, [user]);

  const refreshLogs = useCallback(async () => {
    if (!user) return;
    setLoadingLogs(true);
    try {
      const data = await api.fetchLogs();
      setLogsList(data);
    } finally {
      setLoadingLogs(false);
    }
  }, [user]);

  const verifyHash = useCallback(async (hash) => {
    if (!user) return null;
    const data = await api.verifyHash(hash);
    return data.result;
  }, [user]);

  /* ── Value ────────────────────────────────────────────────────── */

  const value = {
    // Auth
    user,
    isAuthenticated,
    login,
    signup,
    googleLogin,
    logout,

    // Nav
    activePage,
    setActivePage,

    // Evidence
    evidenceList,
    loadingEvidence,
    refreshEvidence,
    uploadEvidence,

    // Logs
    logsList,
    loadingLogs,
    refreshLogs,

    // Verify
    verifyHash,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}
