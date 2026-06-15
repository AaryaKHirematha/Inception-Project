const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";

/* ── Helper ─────────────────────────────────────────────────────── */

async function getToken() {
  try {
    const SecureStore = require("expo-secure-store");
    return await SecureStore.getItemAsync("token");
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function authRequest(path, options = {}) {
  const token = await getToken();
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return request(path, { ...options, headers });
}

/* ── API ────────────────────────────────────────────────────────── */

export const api = {
  login: async (email, password, role) => {
    return request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
  },

  signup: async (name, email, password, role) => {
    return request("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  fetchEvidence: async () => {
    return authRequest("/api/evidence");
  },

  uploadEvidence: async (fileName, fileSize, caseId) => {
    return authRequest("/api/evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, fileSize, caseId }),
    });
  },

  verifyHash: async (hash) => {
    return authRequest("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash }),
    });
  },

  fetchLogs: async () => {
    return authRequest("/api/logs");
  },
};
