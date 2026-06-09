export const api = {
  login: async (email, password, role) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },

  signup: async (name, email, password, role) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    return data;
  },

  googleLogin: async () => {
    const res = await fetch("/api/auth/google", {
      method: "POST"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Google login failed");
    return data;
  },

  fetchEvidence: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/evidence", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch evidence");
    return res.json();
  },

  uploadEvidence: async (fileName, fileSize, caseId) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/evidence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ fileName, fileSize, caseId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to upload evidence");
    return data;
  },

  verifyHash: async (hash) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ hash })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to verify hash");
    return data;
  },

  fetchLogs: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/logs", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch logs");
    return res.json();
  }
};
