import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useGlobal } from "../context/GlobalContext";
import { styles } from "../styles/theme";

/* ── Action Badge ────────────────────────────────────────────────── */

const actionColors = {
  UPLOAD: { bg: "#eef2ff", text: "#4f46e5" },
  VERIFY: { bg: "#d1fae5", text: "#059669" },
  ACCESS: { bg: "#e0f2fe", text: "#0284c7" },
};

function ActionBadge({ action }) {
  const colors = actionColors[action] || { bg: "#f1f5f9", text: "#64748b" };
  return (
    <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
      <Text style={{ fontSize: 10, fontWeight: "800", color: colors.text, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {action}
      </Text>
    </View>
  );
}

/* ── Logs Screen ─────────────────────────────────────────────────── */

export default function LogsScreen() {
  const { user, logsList, loadingLogs, refreshLogs } = useGlobal();

  useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  /* Public gate */
  if (user?.role === "public") {
    return (
      <View style={{ flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", padding: 24 }}>
        <View style={[styles.card, { backgroundColor: "#fef2f2", borderColor: "#fecaca", borderWidth: 1 }]}>
          <Text style={{ fontSize: 14, color: "#dc2626", fontWeight: "600", textAlign: "center" }}>
            ⛔ Access Denied — Logs are restricted to authorized personnel.
          </Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={[styles.card, { marginBottom: 10 }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <ActionBadge action={item.action} />
        <Text style={{ fontSize: 11, color: "#94a3b8", fontWeight: "500" }}>
          {new Date(item.timestamp).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <Text style={{ fontSize: 14, fontWeight: "600", color: "#1e293b", marginBottom: 4 }}>
        {item.details}
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.metaText}>👤 {item.user}</Text>
        <Text style={styles.metaText}>📁 {item.caseId}</Text>
      </View>
    </View>
  );

  const ListEmpty = () => (
    <View style={{ alignItems: "center", paddingVertical: 40 }}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
      <Text style={{ fontSize: 16, fontWeight: "700", color: "#64748b" }}>No Logs Available</Text>
      <Text style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, textAlign: "center" }}>
        Audit trail entries will appear here.
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {loadingLogs && logsList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={{ marginTop: 12, color: "#94a3b8", fontWeight: "500" }}>Loading audit logs…</Text>
        </View>
      ) : (
        <FlatList
          data={logsList}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loadingLogs} onRefresh={refreshLogs} tintColor="#6366f1" />
          }
        />
      )}
    </View>
  );
}
