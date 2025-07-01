import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY,
});

export const CalculateCaloriesAI = async (PROMPT) =>
  await openai.chat.completions.create({
    model: "google/gemini-2.5-pro-exp-03-25",
    messages: [
      {
        role: "user",
        content: PROMPT,
      },
    ],
  });

// console.log(CalculateCaloriesAI.choices[0].message);
