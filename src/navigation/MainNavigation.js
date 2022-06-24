import React, { useState, useEffect, useMemo, useContext } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import {
	getFocusedRouteNameFromRoute,
	NavigationContainer,
	DarkTheme,
	DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-root-toast";

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
import { TabButton } from "../components";
import { navigationRef } from "./RootNavigation";
import { ThemeContext } from "../components/ThemeManager";

// const homeName = "Home"; // Home stack commented out because currently not in use
const trackName = "Track";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();
const LoginStack = createNativeStackNavigator();
// const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const TrackStack = createNativeStackNavigator();
const AddStack = createNativeStackNavigator();

const MainNavigation = () => {
	/**
	 * This hook serves as a listener to auth state changes provided by firebase.
	 */
	const [isAuth, setIsAuth] = useState(false);
	const { darkTheme } = useContext(ThemeContext);


	const verifyAccountToast = () => {
		Toast.show("Verify your email to login.", {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
	};

	// Helper Functions

	useEffect(() => {
		// Checks with firebase whether the user is signed in
		const unsubscribeAuthStateChanged = onAuthStateChanged(
			auth,
			(authenticatedUser) => {
				if (authenticatedUser) {
					if ((!auth.currentUser.emailVerified)) {
						setIsAuth(false);
						verifyAccountToast();
					} else {
						setIsAuth(true);
					}
				} else {
					setIsAuth(false)
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
		});
	};

	const LogoutIcon = () => (
		<TouchableOpacity onPress={logoutHandler}>
			<MaterialIcons name="logout" size={28} color="#407BFF" />
		</TouchableOpacity>
	);

	const TrackNavigator = ({ navigation, route }) => {
		const tabHiddenRoutes = ["Item Details", "Edit Item"];
		useEffect(() => {
			if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
				navigation.setOptions({ tabBarStyle: { display: "none" } });
			} else {
				navigation.setOptions({
					tabBarStyle: { ...styles.tabBar },
				});
			}
		}, [navigation, route]);

		return (
			<TrackStack.Navigator
				initialRouteName="Currently Tracking"
				screenOptions={{
					headerLargeTitle: "Currently Tracking",
				}}
			>
				<TrackStack.Screen
					name="Currently Tracking"
					component={Track}
				/>
				<TrackStack.Screen
					name="Item Details"
					component={ItemDetails}
				/>
				<TrackStack.Screen name="Edit Item" component={EditItem} />
			</TrackStack.Navigator>
		);
	};

	const AddNavigator = () => (
		<AddStack.Navigator>
			<AddStack.Screen name="Add Item" component={AddItem} />
		</AddStack.Navigator>
	);

	const BottomTabButton = ({ children, onPress }) => {
		return (
			<TouchableOpacity style={styles.BottomTabButton} onPress={onPress}>
				<View style={styles.BottomTabButtonView}>{children}</View>
			</TouchableOpacity>
		);
	};

	const MainNavigator = () => (
		<Tab.Navigator
			initialRouteName={trackName}
			screenOptions={({ route }) => ({
				tabBarButton: (props) => {
					let item;
					let currentTab = route.name;

					if (currentTab === trackName) {
						item = {
							route: trackName,
							iconName: "show-chart",
						};
					} else if (currentTab === settingsName) {
						item = {
							route: settingsName,
							iconName: "settings",
						};
					}
					return <TabButton {...props} item={item} />;
				},
				tabBarStyle: styles.tabBar,
				headerShown: false,
				tabBarShowLabel: false,
			})}
		>
			{/* <Tab.Screen
				name={homeName}
				component={HomeNavigator}
				options={{ headerShown: false }}
			/> */}
			<Tab.Screen name={trackName} component={TrackNavigator} />
			<Tab.Screen
				name={"Add"}
				component={AddNavigator}
				options={{
					tabBarIcon: ({ focused }) => {
						return (
							<View style={{ left: 1 }}>
								<Ionicons name="add" size={40} color="#fff" />
							</View>
						);
					},
					tabBarButton: (props) => {
						return <BottomTabButton {...props} />;
					},
					...styles.tabScreen,
				}}
			/>
			<Tab.Screen name={settingsName} component={SettingsNavigator} />
		</Tab.Navigator>
	);

	// If user is authenticated by Firebase, bring user to the main screen.
	// Else bring user to login screen
	return (
		<NavigationContainer
			ref={navigationRef}
			theme={darkTheme ? DarkTheme : DefaultTheme}
		>
			{isAuth ? <MainNavigator /> : <LoginNavigator />}
		</NavigationContainer>
	);
};

export default MainNavigation;

const styles = StyleSheet.create({
	tabBar: {
		height: 50,
		position: "absolute",
		bottom: 20,
		right: 20,
		left: 20,
		borderRadius: 15,
		shadowColor: "#7F5df0",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.5,
		elevation: 5,
	},
	BottomTabButton: {
		top: -20,
		justifyContent: "center",
		alignItems: "center",
	},
	BottomTabButtonView: {
		width: 60,
		height: 60,
		borderRadius: 35,
		borderColor: "#fff",
		borderWidth: 2,
		backgroundColor: "rgba(10,132,255,1)",
		shadowColor: "#7F5df0",
		shadowOpacity: 10,
		shadowRadius: 35,
		elevation: 10,
	},
});
