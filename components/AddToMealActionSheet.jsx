import {
  Coffee02Icon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { UserContext } from "../context/UserContext";
import { api } from "../convex/_generated/api";
import Colors from "../shared/Colors";
import DateSelectionCard from "./DateSelectionCard";
import Button from "./shared/Button";
export default function AddToMealActionSheet({
  recipeDetail,
  hideActionSheet,
}) {
  const [dateList, setDateList] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedMeal, setSelectedMeal] = useState();
  const { user } = useContext(UserContext);
  const CreateMealPlan = useMutation(api.MealPlan.CreateMealPlan);
  const mealOptions = [
    {
      title: "Breakfast",
      icon: Coffee02Icon,
    },
    {
      title: "Lunch",
      icon: Sun03Icon,
    },
    {
      title: "Dinner",
      icon: Moon02Icon,
    },
  ];

  const AddToMealPlan = async () => {
    if (!selectedDate && !selectedMeal) {
      Alert.alert("Error!", "Please Select All Details");
      return;
    }

    const result = await CreateMealPlan({
      date: selectedDate,
      mealType: selectedMeal,
      recipeId: recipeDetail?._id,
      uid: user?._id,
    });
    console.log(result);
    Alert.alert("Added!", "Added to Meal Plan");
    hideActionSheet();
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

      {/* Select Meal */}
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
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedMeal(item.title)}
            style={{
              flex: 1,
              alignItems: "center",
              padding: 10,
              borderWidth: 1,
              borderRadius: 10,
              margin: 5,
              backgroundColor:
                selectedMeal === item.title ? Colors.SECONDERY : Colors.WHITE,
              borderColor:
                selectedMeal === item.title ? Colors.PRIMARY : Colors.GRAY,
            }}
          >
            <item.icon
              color={selectedMeal === item.title ? Colors.PRIMARY : Colors.GRAY}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
      <View
        style={{
          marginTop: 15,
        }}
      >
        <Button title={"+ Add to Meal Plan"} onPress={AddToMealPlan} />
        <TouchableOpacity
          onPress={() => hideActionSheet()}
          style={{
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
