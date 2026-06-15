import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useGlobal } from "../context/GlobalContext";
import { styles } from "../styles/theme";

export default function DashboardScreen() {
  const { user, evidenceList, loadingEvidence, refreshEvidence } = useGlobal();

  useEffect(() => {
    refreshEvidence();
  }, [refreshEvidence]);

  /* ── Stats ─────────────────────────────────────────────────────── */

  const totalItems = evidenceList.length;
  const verifiedItems = evidenceList.filter((e) => e.status === "Verified").length;
  const pendingItems = evidenceList.filter((e) => e.status === "Pending").length;

  const stats = [
    { label: "Total Evidence", value: totalItems, color: "#6366f1" },
    { label: "Verified", value: verifiedItems, color: "#10b981" },
    { label: "Pending", value: pendingItems, color: "#f59e0b" },
  ];

  /* ── Render ────────────────────────────────────────────────────── */

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#1e293b", flex: 1 }} numberOfLines={1}>
          {item.fileName}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === "Verified" ? "#d1fae5" : "#fef3c7" },
          ]}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "800",
              color: item.status === "Verified" ? "#059669" : "#d97706",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
        <Text style={styles.metaText}>Case: {item.caseId}</Text>
        <Text style={styles.metaText}>{item.fileSize}</Text>
      </View>

      <View style={styles.hashContainer}>
        <Text style={styles.hashText} numberOfLines={1}>
          🔗 {item.hash}
        </Text>
      </View>

      <Text style={[styles.metaText, { marginTop: 8 }]}>
        By {item.uploadedBy} · {new Date(item.uploadDate).toLocaleDateString()}
      </Text>
    </View>
  );

  const ListHeader = () => (
    <View>
      {/* Welcome */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "#1e293b" }}>
          Welcome, {user?.name || "User"} 👋
        </Text>
        <Text style={{ fontSize: 14, color: "#94a3b8", marginTop: 4, fontWeight: "500" }}>
          Here's your evidence overview
        </Text>
      </View>

      {/* Stats Row */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        {stats.map((stat) => (
          <View key={stat.label} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <Text style={{ fontSize: 24, fontWeight: "800", color: "#1e293b" }}>{stat.value}</Text>
            <Text style={{ fontSize: 11, color: "#94a3b8", fontWeight: "600", marginTop: 2 }}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Section Header */}
      <Text style={{ fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 12 }}>
        Recent Evidence
      </Text>
    </View>
  );

  const ListEmpty = () => (
    <View style={{ alignItems: "center", paddingVertical: 40 }}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>📁</Text>
      <Text style={{ fontSize: 16, fontWeight: "700", color: "#64748b" }}>No Evidence Found</Text>
      <Text style={{ fontSize: 13, color: "#94a3b8", marginTop: 4, textAlign: "center" }}>
        Evidence uploaded by your team will appear here.
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {loadingEvidence && evidenceList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={{ marginTop: 12, color: "#94a3b8", fontWeight: "500" }}>Loading evidence…</Text>
        </View>
      ) : (
        <FlatList
          data={evidenceList}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loadingEvidence} onRefresh={refreshEvidence} tintColor="#6366f1" />
          }
        />
      )}
    </View>
  );
}
