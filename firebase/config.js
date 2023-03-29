import AsyncStorage from "@react-native-async-storage/async-storage";
import "firebase/storage";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTtkqVu_DngsQD6aTD2rVK3jyrT3Vv8ds",
  authDomain: "react-native-4bce6.firebaseapp.com",
  projectId: "react-native-4bce6",
  storageBucket: "react-native-4bce6.appspot.com",
  messagingSenderId: "66022049547",
  appId: "1:66022049547:web:08d6952a3bb3b537a5c40e",
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const fsbase = getFirestore(app);
