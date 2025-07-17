import { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import RecipeOptionList from "../../components/RecipeOptionList";
import { GenerateAIRecipe } from "../../services/AiModel";
import Button from "./../../components/shared/Button";
import Colors from "./../../shared/Colors";
import Prompt from "./../../shared/Prompt";

export default function GenerateAiRecipe() {
  // ✅ Fixed: Use array destructuring instead of object destructuring
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeOption, setRecipeOption] = useState([]);

  const GenerateRecipeOptions = async () => {
    // Add validation
    if (!input || input.trim() === "") {
      alert("Please enter ingredients or recipe name");
      return;
    }

    setLoading(true);

    try {
      // Make AI Model call to generate recipe Options
      const PROMPT = input + Prompt.GENERATE_RECIPE_OPTION_PROMPT;
      console.log("🤖 Sending prompt:", PROMPT);

      const result = await GenerateAIRecipe(PROMPT);
      console.log("📝 AI Response:", result.choices[0].message);

      // Extract and parse JSON
      const extractJson = result.choices[0].message.content
        .replace("```json", "")
        .replace("```", "")
        .trim();

      console.log("🔍 Extracted JSON:", extractJson);

      const parsedJSONResp = JSON.parse(extractJson);
      console.log("✅ Parsed Response:", parsedJSONResp);

      setRecipeOption(parsedJSONResp);
    } catch (error) {
      console.error("❌ Error generating recipe:", error);

      // Better error handling
      if (error instanceof SyntaxError) {
        alert("Failed to parse AI response. Please try again.");
      } else {
        alert("Failed to generate recipe. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        paddingTop: Platform.OS == "ios" ? 40 : 30,
        padding: 20,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
        }}
      >
        AI Recipe Generator
      </Text>
      <Text
        style={{
          marginTop: 5,
          color: Colors.GRAY,
          fontSize: 16,
        }}
      >
        Generate Personalized recipes using AI
      </Text>

      <TextInput
        style={styles.textArea}
        onChangeText={(value) => setInput(value)}
        value={input} // ✅ Add controlled input
        placeholder="Enter your ingredients or recipe name"
        multiline={true} // ✅ Enable multiline for better UX
        textAlignVertical="top"
      />

      <View
        style={{
          marginTop: 25,
        }}
      >
        <Button
          title={loading ? "Generating..." : "Generate Recipe"}
          onPress={GenerateRecipeOptions}
          loading={loading}
          disabled={loading || !input?.trim()} // ✅ Disable when loading or empty
        />
      </View>

      {recipeOption?.length > 0 && <RecipeOptionList recipeOption={recipeOption} />}
    </View>
  );
}

const styles = StyleSheet.create({
  textArea: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    marginTop: 15,
    height: 150,
    textAlignVertical: "top",
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GRAY, // ✅ Add border color
  },
});
