import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import Colors from "../shared/Colors";

export default function GenerateRecipeCard() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={[Colors.BLUE, Colors.PRIMARY]}
      style={{
        marginTop: 15,
        padding: 15,
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          fontSize: 23,
          fontWeight: "bold",
          color: Colors.WHITE,
        }}
      >
        Need Meal Ideas?✨
      </Text>
      <Text
        style={{
          color: Colors.WHITE,
          fontSize: 18,
          opacity: 0.8,
          marginTop: 7,
        }}
      >
        Let Our generate personalized recipes just for you!
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/generate-ai-recipe")}
        style={{
          padding: 12,
          backgroundColor: Colors.WHITE,
          marginTop: 10,
          borderRadius: 8,
          width: 190,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: Colors.PRIMARY,
          }}
        >
          Generate with AI
        </Text>
        <Ionicons name="arrow-forward" size={24} color={Colors.PRIMARY} />
      </TouchableOpacity>
    </LinearGradient>
  );
}
