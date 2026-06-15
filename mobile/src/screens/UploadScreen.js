import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import { useGlobal } from "../context/GlobalContext";
import { styles } from "../styles/theme";

/* ── Helpers ────────────────────────────────────────────────────── */

const fmt = (b) =>
  b < 1024
    ? b + " B"
    : b < 1048576
    ? (b / 1024).toFixed(1) + " KB"
    : (b / 1048576).toFixed(1) + " MB";

export default function UploadScreen() {
  const { user, uploadEvidence } = useGlobal();

  const [files, setFiles] = useState([]);
  const [caseRef, setCaseRef] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  /* ── Role Gate ──────────────────────────────────────────────── */

  if (user?.role !== "admin") {
    return (
      <View style={{ flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", padding: 24 }}>
        <View style={[styles.card, { backgroundColor: "#fef2f2", borderColor: "#fecaca", borderWidth: 1 }]}>
          <Text style={{ fontSize: 14, color: "#dc2626", fontWeight: "600", textAlign: "center" }}>
            ⛔ Access Denied — Only court officials can upload evidence.
          </Text>
        </View>
      </View>
    );
  }

  /* ── File Picker ───────────────────────────────────────────── */

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map((asset) => ({
          id: Math.random().toString(36).slice(2),
          name: asset.name,
          size: asset.size,
          uri: asset.uri,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "File Selection Failed", text2: err.message });
    }
  };

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  /* ── Upload ────────────────────────────────────────────────── */

  const handleUpload = async () => {
    if (!files.length || !caseRef.trim()) {
      Toast.show({ type: "error", text1: "Missing Info", text2: "Please add files and a case reference." });
      return;
    }
    setUploading(true);
    try {
      for (const f of files) {
        await uploadEvidence({
          fileName: f.name,
          fileSize: fmt(f.size),
          caseId: caseRef.trim(),
        });
      }
      setDone(true);
      Toast.show({ type: "success", text1: "Evidence Anchored", text2: "Records saved to the ledger." });
    } catch (err) {
      Toast.show({ type: "error", text1: "Upload Failed", text2: err.message });
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

  /* ── Success Screen ────────────────────────────────────────── */

  if (done) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", padding: 24 }}>
        <View style={[styles.card, { alignItems: "center", paddingVertical: 40 }]}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>✅</Text>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#1e293b", marginBottom: 8 }}>
            Evidence Anchored
          </Text>
          <Text style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", marginBottom: 24 }}>
            {files.length} file(s) have been recorded on the ledger.
          </Text>
          <TouchableOpacity onPress={reset} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Upload More Evidence</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /* ── Main Form ─────────────────────────────────────────────── */

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Case Info */}
      <View style={styles.card}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 4 }}>
          Case Information
        </Text>
        <Text style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20, fontWeight: "500" }}>
          Link this evidence to a specific legal proceeding
        </Text>

        <Text style={styles.label}>Case Reference *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. CASE-2025-089A"
          placeholderTextColor="#94a3b8"
          value={caseRef}
          onChangeText={setCaseRef}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Documentary Evidence"
          placeholderTextColor="#94a3b8"
          value={category}
          onChangeText={setCategory}
        />
      </View>

      {/* File Picker */}
      <TouchableOpacity onPress={pickFiles} style={styles.dropZone}>
        <Text style={{ fontSize: 36, marginBottom: 8 }}>📄</Text>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#475569" }}>Tap to Select Files</Text>
        <Text style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, textAlign: "center" }}>
          Choose documents, images, or media from your device
        </Text>
      </TouchableOpacity>

      {/* File List */}
      {files.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.label, { marginBottom: 12 }]}>
            Files to Anchor ({files.length})
          </Text>
          {files.map((f) => (
            <View key={f.id} style={[styles.card, { flexDirection: "row", alignItems: "center", marginBottom: 8 }]}>
              <Text style={{ fontSize: 20, marginRight: 12 }}>📎</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#1e293b" }} numberOfLines={1}>
                  {f.name}
                </Text>
                <Text style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{fmt(f.size)}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFile(f.id)}>
                <Text style={{ fontSize: 18, color: "#ef4444" }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <TouchableOpacity
          onPress={handleUpload}
          disabled={uploading || !caseRef.trim()}
          style={[styles.primaryBtn, { marginTop: 20, marginBottom: 40 }, uploading && { opacity: 0.6 }]}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>
              Anchor {files.length} {files.length === 1 ? "File" : "Files"}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
