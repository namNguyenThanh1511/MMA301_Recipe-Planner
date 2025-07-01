import {
  Dumbbell01Icon,
  FemaleSymbolFreeIcons,
  HugeiconsIcon,
  MaleSymbolFreeIcons,
  PlusSignSquareIcon,
  WeightScaleIcon,
} from "@hugeicons/core-free-icons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const UpdateUserPref = useMutation(api.Users.UpdateUserPref);
  const OnContinue = async () => {
    if (!weight || !height || !gender) {
      Alert.alert("Fill all details", "Enter all details to continue ");
      return;
    }
    const data = {
      uid: user?._id,
      weight: weight,
      height: height,
      gender: gender,
      goal: goal,
    };
    //Calculate Calories using AI
    const PROMPT = JSON.stringify(data) + Prompt.CALORIES_PROMPT;
    console.log(PROMPT);
    const AIresult = await CalculateCaloriesAI(PROMPT);
    console.log(AIresult.choices[0].message.content);
    const AIResp = AIresult.choices[0].message.content;
    const JSONContent = JSON.parse(
      AIResp.replace("```json", "").replace("```", "")
    );

    console.log(JSONContent);
    const result = await UpdateUserPref({
      ...data,
      ...JSONContent,
    });

    setUserId((prev) => ({
      ...prev,
      ...data,
    }));

    router.replace("/(tabs)/home");
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
        <View
          style={{
            flex: 1,
          }}
        >
          <Input
            placeholder={"e.g 70"}
            label="Weight (kg)"
            onChangeText={setWeight}
          />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Input
            placeholder={"e.g 5.10"}
            label="Height (ft)"
            onChangeText={setHeight}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 20,
        }}
      >
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
              borderColor: gender == "Male" ? Colors.PRIMARY : Colors.GRAY,
              borderRadius: 10,
              flex: 1,
              alignItems: "center",
            }}
          >
            <HugeiconsIcon
              icon={MaleSymbolFreeIcons}
              size={40}
              color={Colors.BLUE}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGender("Female")}
            style={{
              borderWidth: 1,
              padding: 15,
              borderColor: gender == "Female" ? Colors.PRIMARY : Colors.GRAY,
              borderRadius: 10,
              flex: 1,
              alignItems: "center",
            }}
          >
            <HugeiconsIcon
              icon={FemaleSymbolFreeIcons}
              size={40}
              color={Colors.PINK}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          marginTop: 15,
        }}
      >
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
              borderColor: goal == "Weight Loss" ? Colors.PRIMARY : Colors.GRAY,
            },
          ]}
        >
          <HugeiconsIcon icon={WeightScaleIcon} />
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
              borderColor: goal == "Muscle Gain" ? Colors.PRIMARY : Colors.GRAY,
            },
          ]}
        >
          <HugeiconsIcon icon={Dumbbell01Icon} />
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
              borderColor: goal == "Weight Gain" ? Colors.PRIMARY : Colors.GRAY,
            },
          ]}
        >
          <HugeiconsIcon icon={PlusSignSquareIcon} />
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
        <Button title={"Continue"} onPress={OnContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  goalSubText: {
    color: Colors.GRAY,
  },
});
