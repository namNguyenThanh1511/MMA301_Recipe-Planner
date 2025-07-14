import { useState } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import DateSelectionCard from "../../components/DateSelectionCard";
import GenerateRecipeCard from "../../components/GenerateRecipeCard";
import TodayProgress from "../../components/TodayProgress";
import TodaysMealPlan from "../../components/TodaysMealPlan";

export default function Progress() {
  const [selectedDate, setSelectedDate] = useState();
  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            paddingTop: Platform?.OS == "ios" ? 40 : 25,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            Progress
          </Text>
          <DateSelectionCard setSelectedDate={setSelectedDate} />
          <TodaysMealPlan selectedDate={selectedDate} /> {/* ĐÃ SỬA Ở ĐÂY */}
          <TodayProgress />
          <GenerateRecipeCard />
        </View>
      }
    />
  );
}
