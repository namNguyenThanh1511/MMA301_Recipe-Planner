import axios from "axios";
import OpenAI from "openai";

// ✅ Thêm debug log
console.log("🔑 API Key from env:", process.env.EXPO_PUBLIC_OPENROUTER_API_KEY);
console.log("🔑 API Key exists:", !!process.env.EXPO_PUBLIC_OPENROUTER_API_KEY);

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
});

const AIMODELNAME = "google/gemini-2.0-flash-001";

export const CalculateCaloriesAI = async (PROMPT) => {
  try {
    console.log("🚀 Calling OpenRouter API...");
    console.log(
      "🔑 Using API Key:",
      process.env.EXPO_PUBLIC_OPENROUTER_API_KEY?.substring(0, 15) + "..."
    );

    const result = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "user",
          content: PROMPT,
        },
      ],
    });

    console.log("✅ OpenRouter Response:", result);
    return result;
  } catch (error) {
    console.error("❌ OpenRouter Error:", error);
    throw error;
  }
};

export const GenerateAIRecipe = async (PROMPT) =>
  await openai.chat.completions.create({
    model: AIMODELNAME,
    messages: [
      {
        role: "user",
        content: PROMPT,
      },
    ],
    response_format: "json_object",
  });

const BASE_URL = "https://aigurulab.tech";
export const GenerateRecipeImage = async (prompt) =>
  await axios.post(
    BASE_URL + "/api/generate-image",
    {
      width: 1024,
      height: 1024,
      input: prompt,
      model: "sdxl", //'flux'
      aspectRatio: "1:1", //Applicable to Flux model only
    },
    {
      headers: {
        "x-api-key": process.env.EXPO_PUBLIC_AIRGURU_LAB_API_KEY, // Your API Key
        "Content-Type": "application/json", // Content Type
      },
    }
  );
