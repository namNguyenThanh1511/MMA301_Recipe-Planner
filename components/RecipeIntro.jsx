import {
  Fire03Icon,
  PlusSignSquareIcon,
  ServingFoodIcon,
  TimeQuarter02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image, StyleSheet, Text, View } from "react-native"; // Thêm import Image
import Colors from "../shared/Colors";

export default function RecipeIntro({ recipeDetail }) {
  const RecipeJson = recipeDetail?.jsonData;
  return (
    <View>
      <Image
        source={{ uri: recipeDetail?.imageUrl }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 15,
        }}
      />
      <View
        style={{
          marginTop: 15,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
          }}
        >
          {recipeDetail?.recipeName}
        </Text>
        <HugeiconsIcon
          icon={PlusSignSquareIcon}
          size={40}
          color={Colors.PRIMARY}
        />
      </View>
      <Text
        style={{
          fontSize: 16,
          marginTop: 6,
          color: Colors.GRAY,
          lineHeight: 25,
        }}
      >
        {RecipeJson?.description}
      </Text>
      <View
        style={{
          marginTop: 15,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View style={styles.propertiesContatiner}>
          <HugeiconsIcon icon={Fire03Icon} color={Colors.PRIMARY} size={27} />
          <Text style={styles.subText}>Calories</Text>
          <Text style={styles.counts}>{RecipeJson?.calories}</Text>
        </View>
        {/*<View style={styles.propertiesContatiner}>
          <HugeiconsIcon
            icon={Dumbbell01Icon}
            color={Colors.PRIMARY}
            size={27}
          />
          <Text style={styles.subText}>Protiens</Text>
          <Text style={styles.counts}>{RecipeJson?.calories}</Text>
        </View> */}
        <View style={styles.propertiesContatiner}>
          <HugeiconsIcon
            icon={TimeQuarter02Icon}
            color={Colors.PRIMARY}
            size={27}
          />
          <Text style={styles.subText}>Time</Text>
          <Text style={styles.counts}>{RecipeJson?.calories}</Text>
        </View>
        <View style={styles.propertiesContatiner}>
          <HugeiconsIcon
            icon={ServingFoodIcon}
            color={Colors.PRIMARY}
            size={27}
          />
          <Text style={styles.subText}>Serve</Text>
          <Text style={styles.counts}>{RecipeJson?.calories}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBg: {
    padding: 6,
  },
  propertiesContatiner: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fbf5ff",
    padding: 6,
    borderRadius: 10,
    flex: 1,
  },
  subText: {
    fontSize: 18,
  },
  counts: {
    fontSize: 22,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
});
