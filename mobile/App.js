import { Text, ActivityIndicator, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Toast from "react-native-toast-message";

import GlobalProvider, { useGlobal } from "./src/context/GlobalContext";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import UploadScreen from "./src/screens/UploadScreen";
import VerifyScreen from "./src/screens/VerifyScreen";
import LogsScreen from "./src/screens/LogsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ── Tab icon map ────────────────────────────────────────────── */

const TAB_ICONS = {
  Dashboard: "📊",
  Upload: "📤",
  Verify: "🔍",
  Logs: "📋",
};

/* ── Main Tabs ───────────────────────────────────────────────── */

function MainTabs() {
  const { logout } = useGlobal();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#ffffff" },
        headerTitleStyle: { fontWeight: "700", color: "#1e293b" },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#f1f5f9",
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarIcon: ({ focused }) => {
          const emoji = TAB_ICONS[route.name] || "📁";
          return (
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: focused ? "#eef2ff" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 18 }}>{emoji}</Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={logout}
              style={{
                marginRight: 16,
                backgroundColor: "#fef2f2",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#ef4444" }}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Verify" component={VerifyScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
    </Tab.Navigator>
  );
}

/* ── Root Navigator ──────────────────────────────────────────── */

function RootNavigator() {
  const { isAuthenticated, isLoading } = useGlobal();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

/* ── App Entry ───────────────────────────────────────────────── */

export default function App() {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <Toast />
    </GlobalProvider>
  );
}
