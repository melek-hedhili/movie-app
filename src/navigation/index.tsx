import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home";
import MovieDetailsScreen from "../screens/MovieDetails";
import { useTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

function MainNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
