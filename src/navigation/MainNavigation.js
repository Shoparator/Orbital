import React, { useEffect, useContext } from "react";
import {
	NavigationContainer,
	DarkTheme,
	DefaultTheme,
} from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import Toast from "react-native-root-toast";

import { auth } from "../firebase";
import { navigationRef } from "./RootNavigation";
import { ThemeContext } from "../components/Contexts/ThemeManager";
import { AuthContext } from "../components/Contexts/AuthManager";
import { LoginNavigator, DrawerNavigator } from "./";

const MainNavigation = () => {
	/**
	 * This hook serves as a listener to auth state changes provided by firebase.
	 */
	const { isAuth, setIsAuth } = useContext(AuthContext);
	const { darkTheme, toggleTheme } = useContext(ThemeContext);

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

	// Pop up to display message
	const showRes = (text) => {
		Toast.show(text, {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
	};

	// If user is authenticated by Firebase, bring user to the main screen.
	// Else bring user to login screen
	return (
		<NavigationContainer
			ref={navigationRef}
			theme={darkTheme ? DarkTheme : DefaultTheme}
		>
			{isAuth ? <DrawerNavigator /> : <LoginNavigator />}
		</NavigationContainer>
	);
};

export default MainNavigation;