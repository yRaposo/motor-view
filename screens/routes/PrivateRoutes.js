import React from "react";
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../private/HomeScreen";

const Stack = createStackNavigator();

export default function PrivateRoutes() {
    return (
        <RootStack />
    )
}

function RootStack() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerTransparent: true,
                headerTitle: '',
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                />
        </Stack.Navigator>
    )
}