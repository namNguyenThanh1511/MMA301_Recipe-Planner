import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateMealPlan = mutation({
  args: {
    recipeId: v.id("recipes"),
    date: v.string(),
    mealType: v.string(),
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("mealPlan", {
      recipeId: args.recipeId,
      date: args.date,
      mealType: args.mealType,
      uid: args.uid,
    });
    return result;
  },
});

// ✅ FIXED: Changed q.add() to q.and()
export const GetTodayMealPlan = query({
  args: {
    uid: v.id("users"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Fetching meal plans for:", { uid: args.uid, date: args.date });

      // ✅ FIX: Use q.and() instead of q.add()
      const mealPlans = await ctx.db
        .query("mealPlan")
        .filter((q) => q.and(q.eq(q.field("uid"), args.uid), q.eq(q.field("date"), args.date)))
        .collect();

      console.log("Found meal plans:", mealPlans.length);

      if (mealPlans.length === 0) {
        return [];
      }

      // Fetch Recipes belong to Meal Plan
      const result = await Promise.all(
        mealPlans.map(async (mealPlan) => {
          try {
            const recipe = await ctx.db.get(mealPlan.recipeId);
            return {
              mealPlan,
              recipe,
            };
          } catch (error) {
            console.error("Error fetching recipe for meal plan:", mealPlan._id, error);
            // Return meal plan even if recipe is missing
            return {
              mealPlan,
              recipe: null,
            };
          }
        })
      );

      // Filter out meal plans with missing recipes (optional)
      const validResults = result.filter((item) => item.recipe !== null);

      console.log("Returning meal plans with recipes:", validResults.length);
      return validResults;
    } catch (error) {
      console.error("Error in GetTodayMealPlan:", error);
      throw new Error(`Failed to fetch meal plan: ${error.message}`);
    }
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("mealPlan"),
    status: v.boolean(),
    calories: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db.patch(args.id, {
        status: args.status,
        calories: args.calories,
      });
      return result;
    } catch (error) {
      console.error("Error updating meal plan status:", error);
      throw new Error(`Failed to update meal plan: ${error.message}`);
    }
  },
});

export const GetTotalCaloriesConsumed = query({
  args: {
    date: v.string(),
    uid: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const mealPlanResult = await ctx.db
        .query("mealPlan")
        .filter((q) =>
          q.and(
            q.eq(q.field("uid"), args.uid),
            q.eq(q.field("date"), args.date),
            q.eq(q.field("status"), true)
          )
        )
        .collect();

      const totalCalories = mealPlanResult?.reduce((sum, meal) => {
        return sum + (meal.calories ?? 0);
      }, 0);

      console.log("Total calories consumed:", totalCalories);
      return totalCalories || 0;
    } catch (error) {
      console.error("Error calculating total calories:", error);
      return 0;
    }
  },
});

// ✅ BONUS: Additional helpful queries

// Get meal plans by meal type
export const GetMealPlansByType = query({
  args: {
    uid: v.id("users"),
    date: v.string(),
    mealType: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const mealPlans = await ctx.db
        .query("mealPlan")
        .filter((q) =>
          q.and(
            q.eq(q.field("uid"), args.uid),
            q.eq(q.field("date"), args.date),
            q.eq(q.field("mealType"), args.mealType)
          )
        )
        .collect();

      const result = await Promise.all(
        mealPlans.map(async (mealPlan) => {
          const recipe = await ctx.db.get(mealPlan.recipeId);
          return { mealPlan, recipe };
        })
      );

      return result.filter((item) => item.recipe !== null);
    } catch (error) {
      console.error("Error fetching meal plans by type:", error);
      return [];
    }
  },
});

// Delete meal plan
export const DeleteMealPlan = mutation({
  args: {
    id: v.id("mealPlan"),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.id);
      return { success: true };
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      throw new Error(`Failed to delete meal plan: ${error.message}`);
    }
  },
});

// Get weekly meal plan summary
export const GetWeeklyMealPlan = query({
  args: {
    uid: v.id("users"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const mealPlans = await ctx.db
        .query("mealPlan")
        .filter((q) =>
          q.and(
            q.eq(q.field("uid"), args.uid),
            q.gte(q.field("date"), args.startDate),
            q.lte(q.field("date"), args.endDate)
          )
        )
        .collect();

      // Group by date
      const groupedByDate = {};

      for (const mealPlan of mealPlans) {
        if (!groupedByDate[mealPlan.date]) {
          groupedByDate[mealPlan.date] = [];
        }

        try {
          const recipe = await ctx.db.get(mealPlan.recipeId);
          groupedByDate[mealPlan.date].push({
            mealPlan,
            recipe,
          });
        } catch (error) {
          console.error("Error fetching recipe:", error);
        }
      }

      return groupedByDate;
    } catch (error) {
      console.error("Error fetching weekly meal plan:", error);
      return {};
    }
  },
});
