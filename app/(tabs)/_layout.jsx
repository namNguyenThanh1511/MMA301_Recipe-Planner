import {
  AnalyticsUpIcon,
  Home03Icon,
  SpoonAndForkIcon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tabs } from "expo-router";
import Colors from "./../../shared/Colors";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.PRIMARY,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon={Home03Icon}
              size={size}
              color={color}
              strokeWidth={1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Meals"
        options={{
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon={SpoonAndForkIcon}
              size={size}
              color={color}
              strokeWidth={1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Progress"
        options={{
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon={AnalyticsUpIcon}
              size={size}
              color={color}
              strokeWidth={1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon
              icon={UserSquareIcon}
              size={size}
              color={color}
              strokeWidth={1.5}
            />
          ),
        }}
      />
    </Tabs>
  );
}
