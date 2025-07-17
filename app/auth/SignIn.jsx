import { useConvex } from "convex/react";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
import { UserContext } from "../../context/UserContext";
import { api } from "../../convex/_generated/api";
import { auth } from "../../services/FirebaseConfig";

export default function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const convex = useConvex();
  const { user, setUser } = useContext(UserContext);
  const onSignIn = () => {
    if (!email || !password) {
      Alert.alert("Missing Fields!", "Enter All Fields Value");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        const userData = await convex.query(api.Users.GetUser, {
          email: email,
        });
        console.log(userData);
        setUser(userData);
        console.log("Login successful, navigating to main app...");
        router.replace("/(tabs)/Home"); // Chuyển đến main app
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        Alert.alert("Incorrect Email & Password", "Please enter valid email and password");
      });
  };
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Image
        source={require("./../../assets/images/logo.png")}
        style={{
          width: 150,
          height: 150,
          marginTop: 60,
        }}
      />
      <Text
        style={{
          fontSize: 35,
          fontWeight: "bold",
        }}
      >
        Welcome Back
      </Text>
      <View
        style={{
          marginTop: 20,
          width: "100%",
        }}
      >
        <Input placeholder={"Email"} onChangeText={setEmail} />
        <Input placeholder={"Password"} password={true} onChangeText={setPassword} />
        <View
          style={{
            marginTop: 15,
            width: "100%",
          }}
        >
          <Button title={"Sign In"} onPress={() => onSignIn()} />
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginTop: 15,
            }}
          >
            Don't have an account ?
          </Text>
          <Link href={"/auth/SignUp"}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                marginTop: 15,
                fontWeight: "bold",
              }}
            >
              Create New Account
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
