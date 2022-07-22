import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	Login,
	Register,
	Forget,
} from "../screens";

const LoginStack = createNativeStackNavigator();

const LoginNavigator = () => (
    <LoginStack.Navigator initialRouteName={Login}>
        <LoginStack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
        />
        <LoginStack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
        />
        <LoginStack.Screen
            name="Forget"
            component={Forget}
            options={{ headerShown: false }}
        />
    </LoginStack.Navigator>
);

export default LoginNavigator;