import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import Colors from "./../../shared/Colors";

export default function Button({ title, onPress, icon, loading = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        padding: 13,
        backgroundColor: Colors.PRIMARY,
        width: "100%",
        borderRadius: 10,
      }}
    >
      {loading ? (
        <ActivityIndicator color={Colors.WHITE} />
      ) : (
        <Text
          style={{ fontSize: 18, color: Colors.WHITE, textAlign: "center" }}
        >
          {icon && <Text>{icon} </Text>}
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
