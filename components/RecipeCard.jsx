import { Clock01FreeIcons, Fire02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "../shared/Colors";
export default function RecipeCard({ recipe }) {
  const recipeJson = recipe?.jsonData;
  return (
    <Link
      href={"/recipe-detail?recipeId=" + recipe?._id}
      style={{
        flex: 1,
        margin: 5,
      }}
    >
      <View>
        <Image
          source={{ uri: recipe?.imageUrl }}
          style={{
            width: "100%",
            height: 100,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        />
        <View
          style={{
            padding: 10,
            backgroundColor: Colors.WHITE,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
            }}
          >
            {recipe?.recipeName}
          </Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoContainer}>
              <HugeiconsIcon icon={Fire02Icon} color={Colors.RED} size={18} />
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.GRAY,
                }}
              >
                {recipeJson?.calories} kCal
              </Text>
            </View>
            <View style={[styles.infoContainer, { gap: 15, marginTop: 6 }]}>
              <HugeiconsIcon
                icon={Clock01FreeIcons}
                color={Colors.RED}
                size={18}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.GRAY,
                }}
              >
                {recipeJson?.cookTime} Min
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
});
