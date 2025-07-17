import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../convex/_generated/api";
import { CalculateCaloriesAI } from "../../services/AiModel";
import Prompt from "../../shared/Prompt";
import Button from "./../../components/shared/Button";
import Input from "./../../components/shared/Input";
import { UserContext } from "./../../context/UserContext";
import Colors from "./../../shared/Colors";

export default function Preferance() {
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [gender, setGender] = useState();
  const [goal, setGoal] = useState();
  const [loading, setLoading] = useState(false); // ✅ Thêm loading state
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const UpdateUserPref = useMutation(api.Users.UpdateUserPref);

  // In Preferance.js
  const OnContinue = async () => {
    if (!weight || !height || !gender) {
      Alert.alert("Fill all details", "Enter all details to continue ");
      return;
    }

    if (!user || !user._id) {
      Alert.alert("Error", "User not found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const numericWeight = parseFloat(weight);
      const numericHeight = parseFloat(height);

      if (isNaN(numericWeight) || isNaN(numericHeight)) {
        throw new Error("Please enter valid numeric values");
      }

      const data = {
        uid: user._id,
        weight: numericWeight, // ✅ Number
        height: numericHeight, // ✅ Number
        gender: gender,
        goal: goal,
      };

      console.log("📤 Data to send:", data);

      const PROMPT = JSON.stringify(data) + Prompt.CALORIES_PROMPT;
      const AIresult = await CalculateCaloriesAI(PROMPT);

      if (!AIresult?.choices?.[0]) {
        throw new Error("AI response is invalid");
      }

      const AIResp = AIresult.choices[0].message.content;

      const cleanedResponse = AIResp.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const JSONContent = JSON.parse(cleanedResponse);

      const finalData = {
        ...data,
        calories: parseInt(JSONContent.calories) || 0,
        proteins: parseInt(JSONContent.proteins) || 0,
      };

      console.log("📤 Final data to send:", finalData);

      const result = await UpdateUserPref(finalData);
      console.log("💾 Database Update Result:", result);

      router.replace("/(tabs)/Home");
    } catch (error) {
      console.error("❌ Error in OnContinue:", error);
      Alert.alert("Error", `Something went wrong: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 30,
          fontWeight: "bold",
          marginTop: 30,
        }}
      >
        Tell us about yourself
      </Text>
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          color: Colors.GRAY,
        }}
      >
        This help us create your personalized meal plan
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Input
            placeholder={"e.g 70"}
            label="Weight (kg)"
            onChangeText={setWeight}
            keyboardType="numeric" // ✅ Show numeric keyboard
            value={weight}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            placeholder={"e.g 5.10"}
            label="Height (ft)"
            onChangeText={setHeight}
            keyboardType="decimal-pad" // ✅ Show decimal keyboard for height
            value={height}
          />
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontWeight: "medium",
            fontSize: 18,
          }}
        >
          Gender
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setGender("Male")}
            style={{
              borderWidth: 1,
              padding: 15,
              borderColor: gender === "Male" ? Colors.PRIMARY : Colors.GRAY,
              borderRadius: 10,
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 40, color: Colors.BLUE }}>♂</Text>
            <Text style={{ marginTop: 5, fontWeight: "bold" }}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGender("Female")}
            style={{
              borderWidth: 1,
              padding: 15,
              borderColor: gender === "Female" ? Colors.PRIMARY : Colors.GRAY,
              borderRadius: 10,
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 40, color: Colors.PINK || "#FF69B4" }}>♀</Text>
            <Text style={{ marginTop: 5, fontWeight: "bold" }}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 15 }}>
        <Text
          style={{
            fontWeight: "medium",
            fontSize: 18,
          }}
        >
          What's Your Goals
        </Text>

        <TouchableOpacity
          onPress={() => setGoal("Weight Loss")}
          style={[
            styles.goalContainer,
            {
              borderColor: goal === "Weight Loss" ? Colors.PRIMARY : Colors.GRAY,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>⚖️</Text>
          <View>
            <Text style={styles.goalText}>Weight Loss</Text>
            <Text>Reduce body fat & get learner</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setGoal("Muscle Gain")}
          style={[
            styles.goalContainer,
            {
              borderColor: goal === "Muscle Gain" ? Colors.PRIMARY : Colors.GRAY,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>💪</Text>
          <View>
            <Text style={styles.goalText}>Muscle Gain</Text>
            <Text>Build Muscle & get Stronger</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setGoal("Weight Gain")}
          style={[
            styles.goalContainer,
            {
              borderColor: goal === "Weight Gain" ? Colors.PRIMARY : Colors.GRAY,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>📈</Text>
          <View>
            <Text style={styles.goalText}>Weight Gain</Text>
            <Text>Increase healthy body mass</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 25,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* ✅ Thêm loading indicator */}
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator size="small" color={Colors.PRIMARY} />
            <Text style={{ marginLeft: 10 }}>Processing...</Text>
          </View>
        ) : (
          <Button title={"Continue"} onPress={OnContinue} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalContainer: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  goalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  goalSubText: {
    color: Colors.GRAY,
  },
});
