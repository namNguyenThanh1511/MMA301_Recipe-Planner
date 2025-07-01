import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { useState } from "react";
import { UserContext } from "./../context/UserContext";
export default function RootLayout() {
  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
  });
  const [user, setUser] = useState();

  return (
    <ConvexProvider client={convex}>
      <UserContext.Provider value={{ user, setUser }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Recipe Planner" }} />
          <Stack.Screen name="auth/SignIn" options={{ title: "Sign In" }} />
          <Stack.Screen name="auth/SignUp" options={{ title: "Sign Up" }} />
        </Stack>
      </UserContext.Provider>
    </ConvexProvider>
  );
}
