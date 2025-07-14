import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { useConvex } from "convex/react";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { RefreshDataContext } from "../context/RefreshDataContext";
import { UserContext } from "../context/UserContext";
import { api } from "../convex/_generated/api";
import Colors from "../shared/Colors";
import MealPlanCard from "./MealPlanCard";
import Button from "./shared/Button";

export default function TodaysMealPlan({ selectedDate = null }) {
  const [mealPlan, setMealPlan] = React.useState([]);
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const { refreshData } = useContext(RefreshDataContext);

  useEffect(() => {
    if (user) GetTodaysMealPlan();
    // eslint-disable-next-line
  }, [user, refreshData]);

  const GetTodaysMealPlan = async () => {
    const result = await convex.query(api.mealPlan.GetTodaysMealPlan, {
      date: selectedDate ?? moment().format("DD/MM/YYYY"),
      uid: user?._id,
    });
    if (Array.isArray(result)) {
      setMealPlan(result.flat());
    } else if (result) {
      setMealPlan([result]);
    } else {
      setMealPlan([]);
    }
  };

  return (
    <View style={{ marginTop: 15 }}>
      {!selectedDate && (
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>TodaysMealPlan</Text>
      )}
      {!Array.isArray(mealPlan) || mealPlan.length === 0 ? (
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
          <Calendar01Icon size={40} color={Colors.PRIMARY} />
          <Text style={{ fontSize: 18, color: Colors.GRAY, marginBottom: 20 }}>
            You don't have any meal plan for Today.
          </Text>
          <Button title={"Create New Meal Plan"} />
        </View>
      ) : (
        <FlatList
          data={mealPlan}
          renderItem={({ item }) => <MealPlanCard mealPlanInfo={item} />}
          keyExtractor={(item, idx) =>
            item?.mealPlan?._id?.toString() || idx.toString()
          }
        />
      )}
    </View>
  );
}
