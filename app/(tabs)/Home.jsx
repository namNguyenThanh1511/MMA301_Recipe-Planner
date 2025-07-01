import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { View } from "react-native";
import GenerateRecipeCard from "../../components/GenerateRecipeCard";
import HomeHeader from "../../components/HomeHeader";
import TodayProgress from "../../components/TodayProgress";
import TodaysMealPlan from "../../components/TodaysMealPlan";
import { UserContext } from "../../context/UserContext";

export default function Home() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (!user?.weight) {
      router.replace("/preferance");
    }
  }, [user]);
  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <HomeHeader />
      <TodayProgress />
      <GenerateRecipeCard />
      <TodaysMealPlan />
    </View>
  );
}
