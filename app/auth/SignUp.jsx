import { useMutation } from "convex/react";
import { Link } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useContext, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";
import { UserContext } from "../../context/UserContext";
import { api } from "../../convex/_generated/api";
import { auth } from "../../services/FirebaseConfig";

export default function SignUp() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const createNewUser = useMutation(api.Users.createNewUser);
  const { user, setUser } = useContext(UserContext);
  const onSignUp = () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields!", "Enter All Fields Value");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        if (user) {
          const result = await createNewUser({
            name: name,
            email: email,
          });
          console.log(result);
          setUser(result);
          // Navigate to the Home screen
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
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
        Create New Account
      </Text>
      <View
        style={{
          marginTop: 20,
          width: "100%",
        }}
      >
        <Input placeholder={"Full Name"} onChangeText={setName} />
        <Input placeholder={"Email"} onChangeText={setEmail} />
        <Input
          placeholder={"Password"}
          password={true}
          onChangeText={setPassword}
        />
        <View
          style={{
            marginTop: 15,
            width: "100%",
          }}
        >
          <Button title={"Create Account"} onPress={() => onSignUp()} />
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginTop: 15,
            }}
          >
            Already have an account?
          </Text>
          <Link href={"/auth/SignIn"}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                marginTop: 15,
                fontWeight: "bold",
              }}
            >
              Sign In Here
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
