// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Platform } from "react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "project-2025-6b42d.firebaseapp.com",
  projectId: "project-2025-6b42d",
  storageBucket: "project-2025-6b42d.firebasestorage.app",
  messagingSenderId: "1052250845216",
  appId: "1:1052250845216:web:32931ea432e82f8e0dcc45",
  measurementId: "G-TE56CYV5DZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = Platform.OS === 'web' ? getAuth(app) : initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});