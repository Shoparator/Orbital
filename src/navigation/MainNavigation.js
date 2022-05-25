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
} from "../screens";

const homeName = "Home";
const trackName = "Track";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Stack2 = createNativeStackNavigator();
const TrackStack = createNativeStackNavigator();

const MainNavigation = () => {
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

	const HomeStack = () => (
		<Stack2.Navigator>
			<Stack2.Screen name={homeName} component={HomeScreen} />
		</Stack2.Navigator>
	);

	const SettingsStack = () => (
		<Stack2.Navigator>
			<Stack2.Screen
				name={settingsName}
				component={SettingsScreen}
				options={{ headerRight: () => <LogoutIcon /> }}
			/>
		</Stack2.Navigator>
	);

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
			<Stack.Screen
				name="Forget"
				component={Forget}
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
			<TrackStack.Screen name="Currently Tracking" component={Track} />
			<TrackStack.Screen name="Add Item" component={AddItem} />
		</TrackStack.Navigator>
	);

	const MainNavigator = () => (
		<Tab.Navigator
			initialRouteName={homeName}
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					let currentTab = route.name;

					if (currentTab === homeName) {
						iconName = focused ? "home" : "home-outline";
					} else if (currentTab === trackName) {
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
			<Tab.Screen
				name={homeName}
				component={HomeStack}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name={trackName}
				component={TrackNavigator}
				options={{ headerShown: false }}
			/>
			<Tab.Screen
				name={settingsName}
				component={SettingsStack}
				options={{ headerShown: false }}
			/>
		</Tab.Navigator>
	);

	return (
		<NavigationContainer>
			{isAuth ? <MainNavigator /> : <LoginNavigator />}
		</NavigationContainer>
	);
};

export default MainNavigation;
