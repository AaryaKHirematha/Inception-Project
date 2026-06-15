import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { useGlobal } from "../context/GlobalContext";
import { styles } from "../styles/theme";

export default function LoginScreen() {
  const { login, signup } = useGlobal();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  const roles = ["admin", "user", "public"];

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: "error", text1: "Missing Fields", text2: "Email and password are required." });
      return;
    }
    if (!isLogin && !name.trim()) {
      Toast.show({ type: "error", text1: "Missing Fields", text2: "Name is required for signup." });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password, role);
      } else {
        await signup(name.trim(), email.trim(), password, role);
      }
      Toast.show({ type: "success", text1: isLogin ? "Welcome back!" : "Account created!" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Authentication Failed", text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View style={styles.logoCircle}>
            <Text style={{ fontSize: 28 }}>🔐</Text>
          </View>
          <Text style={{ fontSize: 26, fontWeight: "800", color: "#1e293b", marginTop: 16 }}>
            EvidenceVault
          </Text>
          <Text style={{ fontSize: 14, color: "#94a3b8", marginTop: 4, fontWeight: "500" }}>
            Secure Evidence Management
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              onPress={() => setIsLogin(true)}
              style={[styles.toggleBtn, isLogin && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLogin(false)}
              style={[styles.toggleBtn, !isLogin && styles.toggleBtnActive]}
            >
              <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Name field (signup only) */}
          {!isLogin && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Role selector */}
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.label}>Role</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {roles.map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={[
                    styles.roleChip,
                    role === r && styles.roleChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      role === r && styles.roleChipTextActive,
                    ]}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>
                {isLogin ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
