import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { RootSiblingParent } from "react-native-root-siblings";

import MainNavigation from "./src/navigation/MainNavigation";
import { LogBox } from "react-native";
import { db, auth } from "./src/firebase";
import { doc, setDoc } from "firebase/firestore";
import * as RootNavigation from "./src/navigation/RootNavigation";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

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

TaskManager.defineTask(
	BACKGROUND_NOTIFICATION_TASK,
	({ data, error, executionInfo }) => handleNewNotification(data.notification)
);

export default function App() {
	const notificationListener = useRef();
	const responseListener = useRef();

	const handleNewNotification = async (notificationObject) => {
		try {
			console.log(notificationObject);
			const newNotification = {
				id: notificationObject.messageId,
				date: notificationObject.sentTime,
				title: notificationObject.data.title,
				body: notificationObject.data.message,
				data: JSON.parse(notificationObject.data.body),
			};
			// add the code to do what you need with the received notification  and, e.g., set badge number on app icon
			console.log(newNotification);
			await Notifications.setBadgeCountAsync(1);

			RootNavigation.navigate("Track");
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		registerForPushNotificationsAsync();

		// This listener is fired whenever a notification is received while the app is foregrounded
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				console.log(notification);
			});

		// This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				(notification) => {
					handleNewNotification(
						notification.notification.request.trigger.remoteMessage
					);
				}
			);

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(
				responseListener.current
			);
			Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
		};
	}, []);

	return (
		<RootSiblingParent>
			<MainNavigation />
		</RootSiblingParent>
	);
}
