import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* ── Cards ────────────────────────────────────────────────────── */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  /* ── Logo ─────────────────────────────────────────────────────── */
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Toggle (Login) ───────────────────────────────────────────── */
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
  },
  toggleTextActive: {
    color: "#6366f1",
    fontWeight: "700",
  },

  /* ── Labels & Inputs ──────────────────────────────────────────── */
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },

  /* ── Role Chips ───────────────────────────────────────────────── */
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  roleChipActive: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
  },
  roleChipTextActive: {
    color: "#6366f1",
  },

  /* ── Buttons ──────────────────────────────────────────────────── */
  primaryBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  /* ── Stats ────────────────────────────────────────────────────── */
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  /* ── Status Badge ─────────────────────────────────────────────── */
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  /* ── Meta Text ────────────────────────────────────────────────── */
  metaText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },

  /* ── Hash ──────────────────────────────────────────────────────── */
  hashContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  hashText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  monoText: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    fontSize: 12,
  },

  /* ── Drop Zone ────────────────────────────────────────────────── */
  dropZone: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
});
