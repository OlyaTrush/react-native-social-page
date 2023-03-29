import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, Image } from "react-native";
import { useContext, useEffect } from "react";
import { Context } from "../context";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import { authSignOutUser } from "../redux/auth/authOperation";

import screens from "../screens";

const { CreateScreen, PostsScreen, ProfileScreen } = screens;

const backIcon = require("../assets/icon/arrow-left.png");
const LogOutIcon = require("../assets/icon/log-out.png");

const MainTab = createBottomTabNavigator();

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const { currentPath } = useContext(Context);

  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      }}
    >
      <MainTab.Screen
        name="PostsScreen"
        options={{
          tabBarStyle:
            currentPath !== null ? { display: "none" } : { display: "flex" },
          tabBarVisible: currentPath !== null ? false : true,
          headerShown: currentPath !== null ? false : true,
          tabBarVisible: false,
          title: "Публикации",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused, size, color }) => (
            <MaterialIcons
              name="view-list"
              size={focused ? 44 : 34}
              color={focused ? "orange" : color}
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => dispatch(authSignOutUser())}
            >
              <Image source={LogOutIcon} style={{ marginRight: 16 }} />
            </TouchableOpacity>
          ),
        }}
        component={PostsScreen}
      />
      <MainTab.Screen
        name="CreateScreen"
        component={CreateScreen}
        options={{
          tabBarStyle: { display: "none" },
          tabBarVisible: false,
          title: "Создать публикацию",
          headerTitleAlign: "center",
          tabBarIcon: ({ focused, size, color }) => (
            <MaterialIcons
              name="add-circle"
              size={focused ? 44 : 34}
              color={focused ? "orange" : color}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={{ padding: 10 }}
              onPress={() => navigation.navigate("PostsScreen")}
            >
              <Image source={backIcon} style={{ marginLeft: 16 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <MainTab.Screen
        name="ProfileScreen"
        options={{
          headerShown: false,
          tabBarVisible: true,
          tabBarIcon: ({ focused, size, color }) => (
            <MaterialIcons
              name="account-circle"
              size={focused ? 44 : 34}
              color={focused ? "orange" : color}
            />
          ),
        }}
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
}
