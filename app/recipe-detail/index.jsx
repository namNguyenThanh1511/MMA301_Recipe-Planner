import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useRef } from "react";
import { FlatList, Platform, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import AddToMealActionSheet from "../../components/AddToMealActionSheet";
import RecipeIngredients from "../../components/RecipeIngredients";
import RecipeIntro from "../../components/RecipeIntro";
import RecipeSteps from "../../components/RecipeSteps";
import { api } from "../../convex/_generated/api";
import Colors from "../../shared/Colors";
import Button from "./../../components/shared/Button";

export default function RecipeDetail() {
  const { recipeId } = useLocalSearchParams();
  console.log("📋 Recipe ID from params:", recipeId);

  const actionSheetRef = useRef(null);

  // ✅ Fixed: Proper conditional logic
  const actualRecipeId = recipeId || "j977j3n3dswm1e7rzyw50mve9x7e4a2a";
  console.log("🎯 Using Recipe ID:", actualRecipeId);

  // ✅ Only query if we have a valid ID
  const recipeDetail = useQuery(
    api.Recipes.GetRecipeById,
    actualRecipeId ? { id: actualRecipeId } : "skip"
  );

  console.log("📊 Recipe Detail:", recipeDetail);

  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            paddingTop: Platform.OS == "ios" ? 40 : 30,
            backgroundColor: Colors.WHITE,
            height: "100%",
          }}
        >
          {/* Recipe Intro */}
          <RecipeIntro recipeDetail={recipeDetail} />

          {/* Recipe Ingredient */}
          <RecipeIngredients recipeDetail={recipeDetail} />

          {/* Cooking Steps */}
          <RecipeSteps recipeDetail={recipeDetail} />

          <View style={{ marginTop: 15 }}>
            <Button title={"Add to Meal Plan"} onPress={() => actionSheetRef.current.show()} />
          </View>

          <ActionSheet ref={actionSheetRef}>
            <AddToMealActionSheet
              recipeDetail={recipeDetail}
              hideActionSheet={() => actionSheetRef.current.hide()}
            />
          </ActionSheet>
        </View>
      }
    />
  );
}
