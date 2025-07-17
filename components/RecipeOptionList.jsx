import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GenerateAIRecipe, GenerateRecipeImage } from "../services/AiModel";
import Colors from "../shared/Colors";
import Prompt from "../shared/Prompt";
import { UserContext } from "./../context/UserContext";
import { api } from "./../convex/_generated/api";
import LoadingDialog from "./LoadingDialog";

export default function RecipeOptionList({ recipeOption }) {
  const [loading, setLoading] = useState(false);
  const CreateRecipe = useMutation(api.Recipes.CreateRecipe);
  const { user } = useContext(UserContext);
  const router = useRouter();
  const onRecipeOptionSelect = async (recipe) => {
    setLoading(true);
    const PROMPT =
      "RecipeName: " +
      recipe?.recipeName +
      "\nDescription: " +
      recipe?.description +
      "\n" +
      Prompt.GENERATE_COMPLETE_OPTION_PROMPT;

    try {
      // 1. Generate AI Recipe
      const result = await GenerateAIRecipe(PROMPT);
      const extractJson = result.choices[0].message.content
        .replace("```json", "")
        .replace("```", "");
      const parsedJSONResp = JSON.parse(extractJson);
      console.log("✅ Generated recipe:", parsedJSONResp);

      // 2. Generate Recipe Image with proper error handling
      let imageUrl = "https://via.placeholder.com/400x300/f0f0f0/666666?text=Recipe+Image";

      try {
        console.log("🖼️ Generating image for:", parsedJSONResp?.imagePrompt);
        const aiImageResp = await GenerateRecipeImage(parsedJSONResp?.imagePrompt);

        console.log("📊 Image API Response:", aiImageResp?.data);

        // Check if we have credits and valid response
        if (aiImageResp?.data?.result === "Not Enough Credits") {
          console.warn("💳 No credits available for image generation");
          console.log("📝 Using placeholder image instead");
          // Keep default placeholder
        } else if (aiImageResp?.data?.image || aiImageResp?.data?.url) {
          // Success case - extract image URL
          imageUrl = aiImageResp?.data?.image || aiImageResp?.data?.url;
          console.log("✅ Generated image URL:", imageUrl);
        } else {
          console.warn("⚠️ Unexpected response format:", aiImageResp?.data);
          // Keep default placeholder
        }
      } catch (imageError) {
        console.error("❌ Image generation failed:", imageError);
        console.log("📝 Using placeholder image instead");
        // Continue with placeholder image
      }

      // 3. Save to Database
      console.log("💾 Saving recipe with imageUrl:", imageUrl);
      const saveRecipeResult = await CreateRecipe({
        jsonData: parsedJSONResp,
        imageUrl: imageUrl, // ✅ Always has a value
        recipeName: parsedJSONResp?.recipeName,
        uid: user?._id,
      });

      console.log("✅ Recipe saved successfully:", saveRecipeResult);

      // 4. Navigate to recipe detail
      setLoading(false);
      router.push({
        pathname: "/recipe-detail",
        recipeId: saveRecipeResult,
      });
    } catch (error) {
      console.error("❌ Error in recipe creation:", error);
      setLoading(false);
      alert("Failed to create recipe. Please try again.");
    }
  };

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Select Recipe
      </Text>

      <View>
        {recipeOption?.map((item, index) => (
          <TouchableOpacity
            onPress={() => onRecipeOptionSelect(item)}
            key={index}
            style={{
              padding: 15,
              borderWidth: 0.2,
              borderRadius: 15,
              marginTop: 15,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {item?.recipeName}
            </Text>
            <Text
              style={{
                color: Colors.GRAY,
              }}
            >
              {item?.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <LoadingDialog loading={loading} />
    </View>
  );
}
