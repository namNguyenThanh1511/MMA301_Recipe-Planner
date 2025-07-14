import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
});

const AIMODELNAME = "google/gemini-2.5-pro-exp-03-25";

export const CalculateCaloriesAI = async (PROMPT) =>
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

// console.log(CalculateCaloriesAI.choices[0].message);
