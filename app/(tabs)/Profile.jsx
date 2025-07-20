import {
  AnalyticsUpIcon,
  CookBookIcon,
  Login03Icon,
  ServingFoodIcon,
  WalletAdd02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { usePathname, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserContext } from "../../context/UserContext";
import Colors from "../../shared/Colors";
import { auth } from "./../../services/FirebaseConfig";

const MenuOptions = [
  {
    title: "My Progress",
    icon: AnalyticsUpIcon,
    path: "/(tabs)/Progress",
  },
  {
    title: "Explore Recipes",
    icon: CookBookIcon,
    path: "/(tabs)/Meals",
  },
  {
    title: "Ai Recipes",
    icon: ServingFoodIcon,
    path: "/generate-ai-recipe",
  },
  {
    title: "Billing",
    icon: WalletAdd02Icon,
    path: "/billing",
  },
  {
    title: "Logout",
    icon: Login03Icon,
    path: "logout",
  },
];

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user === null && !isLoggingOut) {
      // Only navigate if user is null and not currently logging out
      try {
        router.replace("/auth/SignIn");
      } catch (error) {
        console.error("Navigation error after logout:", error);
      }
    }
  }, [user, isLoggingOut, router]);

  const safeNavigate = (path, method = "push") => {
    try {
      // ✅ Check if router is available
      if (!router) {
        console.error("Router not available");
        return false;
      }

      // ✅ Prevent navigation if already on the same path
      if (pathname === path) {
        console.log("Already on target path:", path);
        return false;
      }

      console.log(`Navigating to: ${path} using ${method}`);

      if (method === "replace") {
        router.replace(path);
      } else {
        router.push(path);
      }

      return true;
    } catch (error) {
      console.error("Navigation error:", error);
      return false;
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts

    try {
      setIsLoggingOut(true);
      console.log("Starting logout process...");

      // ✅ Step 1: Sign out from Firebase first
      await signOut(auth);
      console.log("Firebase signout successful");

      // ✅ Step 2: Clear user context
      setUser(null); // This will trigger the useEffect above

      // ✅ Step 3: Wait for state to update and navigate safely
      setIsLoggingOut(false);
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);

      Alert.alert("Logout Error", "Failed to logout. Please try again.", [
        {
          text: "Retry",
          onPress: () => handleLogout(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    }
  };

  const OnMenuOptionClick = async (menu) => {
    try {
      if (menu.path === "logout") {
        Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => handleLogout(),
          },
        ]);
        return;
      }

      // ✅ Navigate to other screens safely
      if (menu?.path) {
        safeNavigate(menu.path);
      }
    } catch (error) {
      console.error("Menu navigation error:", error);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        paddingTop: Platform?.OS === "ios" ? 40 : 25,
        flex: 1,
        backgroundColor: Colors?.WHITE || "#FFFFFF",
      }}
    >
      {/* Loading Overlay */}
      {isLoggingOut && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={Colors?.PRIMARY || "#007AFF"} />
            <Text style={{ marginTop: 10, fontSize: 16 }}>Logging out...</Text>
          </View>
        </View>
      )}

      {/* Header */}
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: Colors?.DARK_GRAY || "#1C1C1E",
        }}
      >
        Profile
      </Text>

      {/* User Info Section */}
      <View
        style={{
          alignItems: "center",
          marginTop: 15,
          paddingVertical: 20,
        }}
      >
        <Image
          source={require("./../../assets/images/user.png")}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 15,
          }}
        />

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 5,
            color: Colors?.DARK_GRAY || "#1C1C1E",
          }}
        >
          {user?.name || "Guest User"}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: Colors?.GRAY || "#8E8E93",
            marginTop: 5,
          }}
        >
          {user?.email || "No email provided"}
        </Text>
      </View>

      {/* Menu Options */}
      <FlatList
        data={MenuOptions}
        style={{
          marginTop: 20,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `menu-${index}-${item.title}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => OnMenuOptionClick(item)}
            disabled={isLoggingOut}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              marginTop: 5,
              borderRadius: 15,
              backgroundColor: Colors?.WHITE || "#FFFFFF",
              borderWidth: 0.5,
              borderColor: Colors?.LIGHT_GRAY || "#F2F2F7",
              elevation: 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              opacity: isLoggingOut ? 0.5 : 1,
            }}
            activeOpacity={0.7}
          >
            <HugeiconsIcon
              icon={item.icon}
              size={35}
              color={item.path === "logout" ? "#FF3B30" : Colors?.PRIMARY || "#007AFF"}
            />

            <Text
              style={{
                fontSize: 18,
                fontWeight: "400",
                marginLeft: 15,
                color: item.path === "logout" ? "#FF3B30" : Colors?.DARK_GRAY || "#1C1C1E",
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
