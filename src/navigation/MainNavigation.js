import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { auth } from "../firebase";
import {
	Login,
	Track,
	AddItem,
	Register,
	Forget,
	HomeScreen,
	SettingsScreen,
	ItemDetails,
	EditItem,
} from "../screens";
import { navigationRef } from "./RootNavigation";

// const homeName = "Home"; // Home stack commented out because currently not in use
const trackName = "Track";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();
const LoginStack = createNativeStackNavigator();
// const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const TrackStack = createNativeStackNavigator();

const MainNavigation = () => {
	/**
	 * This hook serves as a listener to auth state changes provided by firebase.
	 */
	const [isAuth, setIsAuth] = useState(false);

	// Helper Functions

	useEffect(() => {
		// Checks with firebase whether the user is signed in
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

	// const HomeNavigator = () => (
	// 	<HomeStack.Navigator>
	// 		<HomeStack.Screen name={homeName} component={HomeScreen} />
	// 	</HomeStack.Navigator>
	// );

	const SettingsNavigator = () => (
		<SettingsStack.Navigator>
			<SettingsStack.Screen
				name={settingsName}
				component={SettingsScreen}
				options={{ headerRight: () => <LogoutIcon /> }}
			/>
		</SettingsStack.Navigator>
	);

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

	const logoutHandler = () => {
		signOut(auth).then(() => {
			setIsAuth(false);
			// setUser({});
		});
	};

	const LogoutIcon = () => (
		<TouchableOpacity onPress={logoutHandler}>
			<MaterialIcons name="logout" size={28} color="#407BFF" />
		</TouchableOpacity>
	);

	const TrackNavigator = () => (
		<TrackStack.Navigator initialRouteName="Currently Tracking">
			<TrackStack.Screen name="Currently Tracking" component={Track} />
			<TrackStack.Screen name="Add Item" component={AddItem} />
			<TrackStack.Screen name="Item Details" component={ItemDetails} />
			<TrackStack.Screen name="Edit Item" component={EditItem} />
		</TrackStack.Navigator>
	);

	const MainNavigator = () => (
		<Tab.Navigator
			initialRouteName={trackName}
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					let currentTab = route.name;

					// if (currentTab === homeName) {
					// 	iconName = focused ? "home" : "home-outline";
					// } else

					if (currentTab === trackName) {
						iconName = focused ? "list" : "list-outline";
					} else if (currentTab === settingsName) {
						iconName = focused ? "settings" : "settings-outline";
					}

					return (
						<Ionicons name={iconName} size={size} color={color} />
					);
				},
			})}
		>
			{/* <Tab.Screen
				name={homeName}
				component={HomeNavigator}
				options={{ headerShown: false }}
			/> */}
			<Tab.Screen
				name={trackName}
				component={TrackNavigator}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name={settingsName}
				component={SettingsNavigator}
				options={{ headerShown: false }}
			/>
		</Tab.Navigator>
	);

	// If user is authenticated by Firebase, bring user to the main screen.
	// Else bring user to login screen
	return (
		<NavigationContainer ref={navigationRef}>
			{isAuth ? <MainNavigator /> : <LoginNavigator />}
		</NavigationContainer>
	);
};

export default MainNavigation;
