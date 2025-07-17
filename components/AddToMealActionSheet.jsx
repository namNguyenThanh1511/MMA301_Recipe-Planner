import { useMutation } from "convex/react";
import { useContext, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { UserContext } from "../context/UserContext";
import { api } from "../convex/_generated/api";
import Colors from "../shared/Colors";
import DateSelectionCard from "./DateSelectionCard";
import Button from "./shared/Button";

export default function AddToMealActionSheet({ recipeDetail, hideActionSheet }) {
  const [dateList, setDateList] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedMeal, setSelectedMeal] = useState();
  const { user } = useContext(UserContext);
  const CreateMealPlan = useMutation(api.MealPlan.CreateMealPlan);

  // ✅ Simple emoji solution - works immediately!
  const mealOptions = [
    {
      title: "Breakfast",
      icon: "☕",
      bgColor: "#FFF3E0",
    },
    {
      title: "Lunch",
      icon: "☀️",
      bgColor: "#FFF8E1",
    },
    {
      title: "Dinner",
      icon: "🌙",
      bgColor: "#F3E5F5",
    },
  ];

  const AddToMealPlan = async () => {
    if (!selectedDate || !selectedMeal) {
      Alert.alert("Error!", "Please Select All Details");
      return;
    }

    try {
      const result = await CreateMealPlan({
        date: selectedDate,
        mealType: selectedMeal,
        recipeId: recipeDetail?._id,
        uid: user?._id,
      });
      console.log("✅ Meal plan created:", result);
      Alert.alert("Added!", "Added to Meal Plan");
      hideActionSheet();
    } catch (error) {
      console.error("❌ Error creating meal plan:", error);
      Alert.alert("Error!", "Failed to add to meal plan");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Add to Meal
      </Text>

      <DateSelectionCard setSelectedDate={setSelectedDate} />

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 15,
        }}
      >
        Select Meal
      </Text>

      <FlatList
        data={mealOptions}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedMeal(item.title)}
            style={{
              flex: 1,
              alignItems: "center",
              padding: 15,
              borderWidth: 2,
              borderRadius: 12,
              margin: 5,
              backgroundColor: selectedMeal === item.title ? Colors.SECONDERY : item.bgColor,
              borderColor: selectedMeal === item.title ? Colors.PRIMARY : Colors.LIGHT_GRAY,
            }}
          >
            {/* ✅ Simple emoji icon - no import needed! */}
            <Text
              style={{
                fontSize: 28,
                marginBottom: 5,
              }}
            >
              {item.icon}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: selectedMeal === item.title ? Colors.PRIMARY : Colors.DARK_GRAY,
                textAlign: "center",
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title={"+ Add to Meal Plan"} onPress={AddToMealPlan} />
        <TouchableOpacity onPress={() => hideActionSheet()} style={{ padding: 15 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: Colors.GRAY,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
