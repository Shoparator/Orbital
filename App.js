import React, { useEffect, useState, useRef } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { RootSiblingParent } from "react-native-root-siblings";

import MainNavigation from "./src/navigation/MainNavigation";
import { LogBox } from "react-native";
import { db, auth } from "./src/firebase";
import { doc, setDoc } from "firebase/firestore";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const registerForPushNotificationsAsync = async () => {
	let token;
	if (Device.isDevice) {
		// Checks if real device as notifications only work for real devices
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync(); // Checks if user has already granted permission for notifications
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			// If not ask for permission
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			// If still not print error
			alert("Failed to get push token for push notification!");
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data; // If all ok, store token
	} else {
		alert("Must use physical device for Push Notifications");
	}

	if (token) {
		const res = await setDoc(
			doc(db, "users", auth.currentUser.uid),
			{ token },
			{ merge: true }
		);
	}

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	return token;
};

export default function App() {
	const [expoPushToken, setExpoPushToken] = useState("");
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		registerForPushNotificationsAsync().then((token) =>
			setExpoPushToken(token)
		);

		// This listener is fired whenever a notification is received while the app is foregrounded
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				console.log(notification);
			});

		// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					console.log(response);
				}
			);

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(
				responseListener.current
			);
		};
	}, []);

	return (
		<RootSiblingParent>
			<MainNavigation />
		</RootSiblingParent>
	);
}
