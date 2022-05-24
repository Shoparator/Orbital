import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { auth } from "../firebase";
import { Login, Track, AddItem, Register } from "../screens";

const Stack = createNativeStackNavigator();
const TrackStack = createNativeStackNavigator();

const Navigator = () => {
	/**
	 * This hook serves as a listener to auth state changes provided by firebase.
	 */
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		const unsubscribeAuthStateChanged = onAuthStateChanged(
			auth,
			(authenticatedUser) => {
				if (authenticatedUser) {
					setIsAuth(true);
				} else {
					setIsAuth(false);
				}
			}
		);

		return unsubscribeAuthStateChanged;
	}, []);

	const LoginNavigator = () => (
		<Stack.Navigator initialRouteName={Login}>
			<Stack.Screen
				name="Login"
				component={Login}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Register"
				component={Register}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);

	const logoutHandler = () => {
		signOut(auth).then(() => {
			setIsAuth(false);
			setUser({});
		});
	};

	const LogoutIcon = () => (
		<TouchableOpacity onPress={logoutHandler}>
			<MaterialIcons name="logout" size={28} color="#407BFF" />
		</TouchableOpacity>
	);

	const TrackNavigator = () => (
		<TrackStack.Navigator initialRouteName="Currently Tracking">
			<TrackStack.Screen
				name="Currently Tracking"
				options={{
					headerRight: () => <LogoutIcon />,
				}}
				component={Track}
			/>
			<TrackStack.Screen name="Add Item" component={AddItem} />
		</TrackStack.Navigator>
	);

	return (
		<NavigationContainer>
			{isAuth ? <TrackNavigator /> : <LoginNavigator />}
		</NavigationContainer>
	);
};

export default Navigator;
