export default {
  CALORIES_PROMPT: `Based on Weight,Height,Gender,Goal give me calories and proteins need daily Consider Age as 28 in JSON format and follow the schema:
{
  calories:<>,
  proteins:<>
}`,
  GENERATE_RECIPE_OPTION_PROMPT: `:Depends on user instruction create 3 different Recipe variant with Recipe Name with Emoji,
  2 line description and main ingredients list in JSON format with field recipeName,description,ingredients (without size) only, Do not give me text response`,

  GENERATE_COMPLETE_OPTION_PROMPT: `
       - As per recipeName and description give me recipeName and description as field, Give me all list of ingredients as ingredient ,
       - emoji icons for each ingredient as icon, quantity as quantity, along with detail step by step recipe as steps
       - Total calories as calories (only number), Minutes to cook as cookTime and serving number as serveTo
       - relastic image Text prompt as per reciepe as imagePrompt
       - Give me category List for reciepe from [Breakfast,Lunch,Dinner,Salad,Dessert,Fastfood,Drink,Cake] as category
       - Give me response in JSON format only
       - Schema fromat should be:
       {
       "description": "string",
       "recipeName": "string",
       "calories": "number",
       "category": ["string"],
       "cookTime": "number",
       "imagePrompt": "string",
       "ingredients": [
          { 
              "icon": "string",
              "ingredient": "string",
              "quantity": "string"
       }
       ],
       "serveTo": "number",
       "steps": ["string"]
       }`,
};
