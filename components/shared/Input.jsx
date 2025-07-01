import { Text, TextInput, View } from "react-native";
export default function Input({
  placeholder,
  password = false,
  onChangeText,
  label = "",
}) {
  return (
    <View
      style={{
        marginTop: 15,
        width: "100%",
      }}
    >
      <Text
        style={{
          fontWeight: "medium",
          fontSize: 18,
        }}
      >
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={password}
        onChangeText={(value) => onChangeText(value)}
        style={{
          padding: 15,
          borderWidth: 1,
          borderRadius: 10,
          fontSize: 18,
          paddingVertical: 20,
          width: "100%",
          marginTop: 2,
        }}
      />
    </View>
  );
}
