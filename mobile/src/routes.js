import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import login from "./pages/login";
import main from "./pages/main";
import perfil from "./pages/perfil";
import matchs from "./pages/matchs";

/*
export default createAppContainer( createSwitchNavigator({
  login,
  main,
  perfil,
  matchs
}));*/

export default createAppContainer(
  createBottomTabNavigator(
    {
      Home: main,
      Perfil: perfil,
      Matchs: matchs,
      Sair: login
    },

    {
      tabBarOptions: {
        activeTintColor: "#333",
        inactiveTinColor: "#bdc3c7",
        style: {
          backgroundColor: "#cc4f2f"
        },
        showLabel: true
      },
      backBehavior: "history",
      resetOnBlur: true,
      initialRouteParams: {
        
      },
      unmountInactiveScreens: true,
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = FontAwesome5;
          let iconName;

          if (routeName === "Home") iconName = "home";
          else if (routeName === "Perfil") iconName = "user-alt";
          else if (routeName === "Matchs") iconName = "users";
          else if (routeName === "Sair") iconName = "sign-out-alt";

          return <IconComponent name={iconName} size={24} color={tintColor} />;
        }
      })
    }
  )
);
