import { useConvex } from "convex/react";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { RefreshDataContext } from "../context/RefreshDataContext";
import { UserContext } from "../context/UserContext";
import Colors from "../shared/Colors";
import { api } from "./../convex/_generated/api";

export default function TodayProgress() {
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const [totalCaloriesConsumed, setTotalCaloriesConsumed] = useState(0);
  const [loading, setLoading] = useState(false);
  const { refreshData } = useContext(RefreshDataContext);

  useEffect(() => {
    if (user) {
      GetTotalCaloriesConsumed();
    }
  }, [user, refreshData]);

  const GetTotalCaloriesConsumed = async () => {
    try {
      setLoading(true);
      const dateString = moment().format("DD/MM/YYYY");

      console.log("Fetching calories for:", {
        date: dateString, // ✅ Changed from 'data' to 'date'
        uid: user?._id,
      });

      const result = await convex.query(api.MealPlan.GetTotalCaloriesConsumed, {
        date: dateString, // ✅ FIXED: Changed from 'data' to 'date'
        uid: user?._id,
      });

      console.log("Calories result:", result, typeof result);

      // ✅ Ensure result is a number
      const calories =
        typeof result === "number"
          ? result
          : typeof result === "string"
            ? parseInt(result) || 0
            : Array.isArray(result)
              ? result.reduce((sum, item) => sum + (item.calories || 0), 0)
              : 0;

      setTotalCaloriesConsumed(calories);
    } catch (error) {
      console.error("Error fetching calories:", error);
      setTotalCaloriesConsumed(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe calculations
  const targetCalories = user?.calories || 2000; // Default target
  const consumedCalories = totalCaloriesConsumed || 0;
  const progressPercentage =
    targetCalories > 0 ? Math.min((consumedCalories / targetCalories) * 100, 100) : 0;

  // ✅ Progress status
  const getProgressStatus = () => {
    if (progressPercentage >= 100) return "Goal achieved! 🎉";
    if (progressPercentage >= 90) return "Almost there! 🎯";
    if (progressPercentage >= 70) return "Keep it up! 🔥";
    if (progressPercentage >= 50) return "Good progress! 💪";
    if (progressPercentage >= 25) return "Getting started! 🌱";
    return "Let's begin! ✨";
  };

  const getProgressColor = () => {
    if (progressPercentage >= 100) return "#4CAF50"; // Green
    if (progressPercentage >= 90) return "#8BC34A"; // Light Green
    if (progressPercentage >= 70) return Colors.PRIMARY;
    if (progressPercentage >= 50) return "#FF9800"; // Orange
    return "#2196F3"; // Blue
  };

  if (loading) {
    return (
      <View
        style={{
          marginTop: 15,
          padding: 20,
          backgroundColor: Colors.WHITE,
          borderRadius: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: Colors.GRAY,
            marginTop: 10,
          }}
        >
          Loading your progress...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: 15,
        padding: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: Colors.DARK_GRAY,
          }}
        >
          Today's Goal
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: Colors.GRAY,
            fontWeight: "500",
          }}
        >
          {moment().format("MMM DD, YYYY")}
        </Text>
      </View>

      {/* Calories Display */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: getProgressColor(),
            marginBottom: 8,
          }}
        >
          {consumedCalories}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: Colors.GRAY,
            marginBottom: 4,
          }}
        >
          of {targetCalories} kcal
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: Colors.GRAY,
            fontWeight: "500",
          }}
        >
          {Math.round(progressPercentage)}% completed
        </Text>
      </View>

      {/* Progress Message */}
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          color: Colors.DARK_GRAY,
          fontWeight: "600",
          marginBottom: 20,
        }}
      >
        {getProgressStatus()}
      </Text>

      {/* Progress Bar */}
      <View
        style={{
          backgroundColor: Colors.LIGHT_GRAY,
          height: 8,
          borderRadius: 4,
          marginBottom: 15,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            backgroundColor: getProgressColor(),
            width: `${Math.max(progressPercentage, 2)}%`, // Minimum 2% for visibility
            height: 8,
            borderRadius: 4,
          }}
        />
      </View>

      {/* Stats Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 15,
          borderTopWidth: 1,
          borderTopColor: Colors.LIGHT_GRAY,
        }}
      >
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: Colors.PRIMARY,
            }}
          >
            {consumedCalories}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.GRAY,
              marginTop: 4,
            }}
          >
            Consumed
          </Text>
        </View>

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: targetCalories - consumedCalories > 0 ? Colors.ORANGE : Colors.GREEN,
            }}
          >
            {Math.max(0, targetCalories - consumedCalories)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.GRAY,
              marginTop: 4,
            }}
          >
            Remaining
          </Text>
        </View>

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: Colors.DARK_GRAY,
            }}
          >
            {targetCalories}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.GRAY,
              marginTop: 4,
            }}
          >
            Target
          </Text>
        </View>
      </View>
    </View>
  );
}
