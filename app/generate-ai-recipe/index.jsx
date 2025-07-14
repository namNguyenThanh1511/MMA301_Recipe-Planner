import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { GenerateAIRecipe } from "../../services/AiModel";
import Button from "./../../components/shared/Button";
import Colors from "./../../shared/Colors";
import Prompt from "./../../shared/Prompt";
import RecipeOptionList from "../../components/RecipeOptionList";
export default function GenerateAiRecipe() {
  const { input, setInput } = useState();
  const [loading, setLoading] = useState(false);
  const [recipeOption, setRecipeOption] = useState([]);
  const GenerateRecipeOptions = async () => {
    setLoading(true);
    // Make AI Model call to generate recipe Options
    try {
      const PROMPT = input + Prompt.GENERATE_RECIPE_OPTION_PROMPT;
      const result = await GenerateAIRecipe(PROMPT);
      console.log(result.choices[0].message);
      const extractJson = result.choices[0].message.content
        .replace("```json", "")
        .replace("```", "");
      const parsedJSONResp = JSON.parse(extractJson);
      console.log(parsedJSONResp);
      setRecipeOption(parsedJSONResp);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
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
        placeholder="Enter your ingrdient or recipe name"
      />
      <View
        style={{
          marginTop: 25,
        }}
      >
        <Button
          title={"Generate Recipe"}
          onPress={GenerateRecipeOptions}
          loading={loading}
        />
      </View>

      {recipeOption?.length > 0 && (
        <RecipeOptionList recipeOption={recipeOption} />
      )}
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
  },
});
