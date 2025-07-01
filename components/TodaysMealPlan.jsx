import { Calendar01Icon, HugeiconsFreeIcons } from "@hugeicons/core-free-icons";
import React from "react";
import { Text, View } from "react-native";
import Colors from "../shared/Colors";
import Button from "./shared/Button";

export default function TodaysMealPlan() {
  const [mealPlan, setMealPlan] = React.useState();
  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        TodaysMealPlan
      </Text>
      {!mealPlan && (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            padding: 20,
            backgroundColor: Colors.WHITE,
            marginTop: 15,
            borderRadius: 15,
          }}
        >
          <HugeiconsFreeIcons
            icon={Calendar01Icon}
            size={40}
            color={Colors.PRIMARY}
          />
          <Text
            style={{
              fontSize: 18,
              color: Colors.GRAY,
              marginBottom: 20,
            }}
          >
            You don't have any meal plan for Today.
          </Text>
          <Button title={"Create New Meal Plan"} />
        </View>
      )}
    </View>
  );
}
