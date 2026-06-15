import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { useGlobal } from "../context/GlobalContext";
import { styles } from "../styles/theme";

function DetailRow({ label, value, mono }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          { fontSize: 14, fontWeight: "600", color: "#1e293b" },
          mono && styles.monoText,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

export default function VerifyScreen() {
  const { verifyHash } = useGlobal();

  const [hash, setHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const doVerify = async () => {
    if (!hash.trim()) {
      Toast.show({ type: "error", text1: "Missing Hash", text2: "Please enter a hash to verify." });
      return;
    }
    setVerifying(true);
    setResult(null);
    setNotFound(false);

    try {
      const rec = await verifyHash(hash.trim());
      if (rec) {
        setResult(rec);
        Toast.show({ type: "success", text1: "Evidence Verified" });
      } else {
        setNotFound(true);
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Verification Failed", text2: err.message });
    } finally {
      setVerifying(false);
    }
  };

  const fillDemo = () => {
    setHash("8f4e2b...1a9c");
    setResult(null);
    setNotFound(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Input Card */}
      <View style={styles.card}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 4 }}>
          🔑 Verify by Hash
        </Text>
        <Text style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20, fontWeight: "500" }}>
          Paste an evidence hash to query its ledger record.
        </Text>

        <TextInput
          style={[styles.input, { fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }]}
          placeholder="e.g. 8f4e2b...1a9c"
          placeholderTextColor="#94a3b8"
          value={hash}
          onChangeText={(t) => { setHash(t); setResult(null); setNotFound(false); }}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
          <TouchableOpacity
            onPress={doVerify}
            disabled={verifying || !hash.trim()}
            style={[styles.primaryBtn, { flex: 1 }, verifying && { opacity: 0.6 }]}
          >
            {verifying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Verify Hash</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={fillDemo} style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 12, color: "#6366f1", fontWeight: "600" }}>Try demo hash →</Text>
        </TouchableOpacity>
      </View>

      {/* Result: Verified */}
      {result && (
        <View style={[styles.card, { marginTop: 16, borderLeftWidth: 4, borderLeftColor: "#10b981" }]}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>🛡️</Text>
            <Text style={{ fontSize: 14, fontWeight: "800", color: "#059669", textTransform: "uppercase", letterSpacing: 1 }}>
              Document Verified
            </Text>
          </View>
          <DetailRow label="Evidence ID" value={String(result.id)} />
          <DetailRow label="Case Reference" value={result.caseId} />
          <DetailRow label="File Name" value={result.fileName} />
          <DetailRow label="Uploaded By" value={result.uploadedBy} />
          <DetailRow label="Hash" value={result.hash} mono />
        </View>
      )}

      {/* Not Found */}
      {notFound && (
        <View style={[styles.card, { marginTop: 16, backgroundColor: "#fef2f2", borderColor: "#fecaca", borderWidth: 1 }]}>
          <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 8 }}>⚠️</Text>
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#dc2626", textAlign: "center" }}>
            No Ledger Record Found
          </Text>
          <Text style={{ fontSize: 13, color: "#ef4444", textAlign: "center", marginTop: 4 }}>
            This hash does not match any anchored evidence.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
