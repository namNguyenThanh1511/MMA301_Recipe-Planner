import { useContext } from "react";
import { Image, Text, View } from "react-native";
import { UserContext } from "../context/UserContext";

export default function HomeHeader() {
  const { user } = useContext(UserContext);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Image
        source={require("./../assets/images/user.png")}
        style={{
          width: 60,
          height: 60,
          borderRadius: 99,
        }}
      />
      <View>
        <Text
          style={{
            fontSize: 20,
          }}
        >
          Hello, 👋
        </Text>
        <Text
          style={{
            fontSize: 23,
            fontWeight: "bold",
          }}
        >
          {user?.name}
        </Text>
      </View>
    </View>
  );
}
