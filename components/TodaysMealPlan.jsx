import { useConvex } from "convex/react";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { RefreshDataContext } from "../context/RefreshDataContext";
import { UserContext } from "../context/UserContext";
import { api } from "../convex/_generated/api";
import Colors from "../shared/Colors";
import MealPlanCard from "./MealPlanCard";
import Button from "./shared/Button";

// 📅 Date Picker Component
const DatePickerComponent = ({ selectedDate, onDateSelect }) => {
  const [currentWeek, setCurrentWeek] = useState(moment().startOf("week"));

  // Generate 7 days from current week
  const generateWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = moment(startDate).add(i, "days");
      dates.push({
        date: date.format("DD/MM/YYYY"),
        day: date.format("ddd"),
        dayNumber: date.format("DD"),
        month: date.format("MMM"),
        isToday: date.isSame(moment(), "day"),
        isPast: date.isBefore(moment(), "day"),
      });
    }
    return dates;
  };

  const weekDates = generateWeekDates(currentWeek);

  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => moment(prev).subtract(1, "week"));
  };

  const goToNextWeek = () => {
    setCurrentWeek((prev) => moment(prev).add(1, "week"));
  };

  const goToToday = () => {
    setCurrentWeek(moment().startOf("week"));
    onDateSelect(moment().format("DD/MM/YYYY"));
  };

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Header with navigation */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <TouchableOpacity
          onPress={goToPreviousWeek}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: Colors.LIGHT_GRAY,
          }}
        >
          <Text style={{ fontSize: 18, color: Colors.PRIMARY }}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToToday}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: Colors.PRIMARY,
            }}
          >
            {currentWeek.format("MMMM YYYY")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextWeek}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: Colors.LIGHT_GRAY,
          }}
        >
          <Text style={{ fontSize: 18, color: Colors.PRIMARY }}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Week dates */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        {weekDates.map((dateItem, index) => {
          const isSelected = selectedDate === dateItem.date;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onDateSelect(dateItem.date)}
              style={{
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginHorizontal: 4,
                borderRadius: 12,
                backgroundColor: isSelected
                  ? Colors.PRIMARY
                  : dateItem.isToday
                    ? Colors.SECONDERY
                    : "transparent",
                borderWidth: dateItem.isToday && !isSelected ? 2 : 0,
                borderColor: Colors.PRIMARY,
                opacity: dateItem.isPast && !dateItem.isToday ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: isSelected
                    ? Colors.WHITE
                    : dateItem.isToday
                      ? Colors.PRIMARY
                      : Colors.GRAY,
                  marginBottom: 4,
                }}
              >
                {dateItem.day}
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: isSelected
                    ? Colors.WHITE
                    : dateItem.isToday
                      ? Colors.PRIMARY
                      : Colors.DARK_GRAY,
                }}
              >
                {dateItem.dayNumber}
              </Text>

              {dateItem.isToday && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isSelected ? Colors.WHITE : Colors.PRIMARY,
                    marginTop: 4,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Quick actions */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 15,
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={goToToday}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: Colors.LIGHT_GRAY,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: Colors.PRIMARY,
            }}
          >
            Today
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function TodaysMealPlan({ selectedDate: propSelectedDate = null }) {
  const [mealPlan, setMealPlan] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    propSelectedDate || moment().format("DD/MM/YYYY")
  );
  const { user } = useContext(UserContext);
  const convex = useConvex();
  const { refreshData } = useContext(RefreshDataContext);

  useEffect(() => {
    if (user) GetTodaysMealPlan();
    // eslint-disable-next-line
  }, [user, refreshData, selectedDate]);

  const GetTodaysMealPlan = async () => {
    try {
      const result = await convex.query(api.MealPlan.GetTodayMealPlan, {
        date: selectedDate,
        uid: user?._id,
      });

      console.log("Meal plan result:", result);

      if (Array.isArray(result)) {
        setMealPlan(result.flat());
      } else if (result) {
        setMealPlan([result]);
      } else {
        setMealPlan([]);
      }
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      setMealPlan([]);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const isToday = selectedDate === moment().format("DD/MM/YYYY");
  const selectedDateMoment = moment(selectedDate, "DD/MM/YYYY");
  const dateDisplayText = isToday
    ? "Today's Meal Plan"
    : `Meal Plan - ${selectedDateMoment.format("dddd, MMM DD")}`;

  return (
    <View style={{ marginTop: 15 }}>
      {/* Title */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        {dateDisplayText}
      </Text>

      {/* Date Picker */}
      <DatePickerComponent selectedDate={selectedDate} onDateSelect={handleDateSelect} />

      {/* Meal Plan Content */}
      {!Array.isArray(mealPlan) || mealPlan.length === 0 ? (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            padding: 30,
            backgroundColor: Colors.WHITE,
            marginTop: 15,
            borderRadius: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {/* Calendar emoji */}
          <Text
            style={{
              fontSize: 48,
              marginBottom: 15,
            }}
          >
            📅
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: Colors.DARK_GRAY,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            No meal plan found
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: Colors.GRAY,
              textAlign: "center",
              marginBottom: 20,
              lineHeight: 20,
            }}
          >
            {isToday
              ? "You don't have any meal plan for today.\nStart planning your healthy meals!"
              : `No meal plan scheduled for ${selectedDateMoment.format("MMM DD, YYYY")}.`}
          </Text>

          <Button
            title={"+ Create New Meal Plan"}
            onPress={() => {
              // Navigate to meal plan creation
              console.log("Create meal plan for:", selectedDate);
            }}
          />
        </View>
      ) : (
        <View
          style={{
            backgroundColor: Colors.WHITE,
            borderRadius: 15,
            padding: 15,
            marginTop: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {/* Meal count header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
              paddingBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: Colors.LIGHT_GRAY,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: Colors.DARK_GRAY,
              }}
            >
              {mealPlan.length} meal{mealPlan.length > 1 ? "s" : ""} planned
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: Colors.GRAY,
              }}
            >
              {selectedDateMoment.format("MMM DD, YYYY")}
            </Text>
          </View>

          <FlatList
            data={mealPlan}
            renderItem={({ item, index }) => (
              <View style={{ marginBottom: index < mealPlan.length - 1 ? 10 : 0 }}>
                <MealPlanCard mealPlanInfo={item} />
              </View>
            )}
            keyExtractor={(item, idx) => item?.mealPlan?._id?.toString() || idx.toString()}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
}
