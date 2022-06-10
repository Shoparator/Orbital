import React, { useState, useEffect, useLayoutEffect } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	KeyboardAvoidingView,
	FlatList,
	TouchableOpacity,
} from "react-native";
import {
	onSnapshot,
	query,
	collection,
	getDocs,
	getDoc,
	doc,
} from "firebase/firestore";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

import { db, auth } from "../firebase";

import { ItemButton, SearchBar } from "../components";
import ActionButton from "react-native-action-button";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const BACKGROUND_FETCH_TASK = "background-fetch";

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
	console.log("2nd running");

	try {
		const query = await getDocs(
			collection(db, "track", "users", auth.currentUser.uid)
		);

		query.forEach((doc) => {
			if (parseFloat(doc.price1) <= parseFloat(doc.thresholdPrice)) {
				Notifications.scheduleNotificationAsync({
					content: {
						title: "Price dropped for " + doc.name + "!",
						body: "Click here to view.",
					},
					trigger: null,
				});
				sendPushNotification(doc.name);
			}
		});
		// Be sure to return the successful result type!
		console.log("Background success");
		return BackgroundFetch.BackgroundFetchResult.NewData;
	} catch (e) {
		console.log("Background failed");
		console.log(e);
		return BackgroundFetch.BackgroundFetchResult.Failed;
	}
});

const sendPushNotification = async (name) => {
	const token = await (
		await getDoc(doc(db, "users", auth.currentUser.uid))
	).data().token;
	console.log(token);
	const message = {
		to: token,
		sound: "default",
		title: "Price dropped for " + name + "!",
		body: "Click here to view.",
		data: { someData: "goes here" },
		priority: high,
	};

	await fetch("https://exp.host/--/api/v2/push/send", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Accept-encoding": "gzip, deflate",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(message),
	});
};

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
const registerBackgroundFetchAsync = async () => {
	return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
		minimumInterval: 1, // 15 minutes
		stopOnTerminate: true, // android only,
		startOnBoot: true, // android only
	});
};

const Track = ({ navigation }) => {
	const [listings, setListings] = useState([]);
	const [searchPhrase, setSearchPhrase] = useState("");
	const [clicked, setClicked] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={refresh}>
					<MaterialIcons name="refresh" size={30} color="#407BFF" />
				</TouchableOpacity>
			),
		});
	}, []);

	// Helper Functions
	useEffect(() => {
		// Retrieve the data stored in firestore and stores in listings array
		const listingsQuery = query(
			collection(db, "track", "users", auth.currentUser.uid)
		);

		const unsubscribe = onSnapshot(listingsQuery, (snapshot) => {
			snapshot.docChanges;
			const listings = [];

			snapshot.forEach((doc) => {
				listings.push({ id: doc.id, ...doc.data() });
			});

			setListings([...listings]);
		});
		return unsubscribe;
	}, [refresh]); // Temporary measure to prevent useEffect from constantly happening.

	useEffect(() => {
		listings.forEach((item) => {
			if (parseFloat(item.price1) <= parseFloat(item.thresholdPrice)) {
				Notifications.scheduleNotificationAsync({
					content: {
						title: "Price dropped for " + item.name + "!",
						body: "Click here to view.",
					},
					trigger: null,
				});
			}
		});
	}, []);

	// Refreshes the list by triggering the above
	const refresh = () => {
		setIsRefresh(true);
		setIsRefresh(false);
	};

	registerBackgroundFetchAsync();

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : null}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.contentContainer}>
					<SearchBar
						searchPhrase={searchPhrase}
						setSearchPhrase={setSearchPhrase}
						clicked={clicked}
						setClicked={setClicked}
					/>
					<View style={styles.listContainer}>
						<FlatList
							data={listings.filter((item) =>
								item.name
									.toLowerCase()
									.includes(searchPhrase.toLowerCase())
							)}
							renderItem={({ item, index }) => (
								<ItemButton data={item} key={index} />
							)}
							style={styles.list}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				</View>
			</SafeAreaView>
			<ActionButton
				buttonColor="rgba(10,132,255,1)"
				onPress={() => {
					navigation.navigate("Add Item");
				}}
			/>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		flex: 1,
	},
	listContainer: {
		flex: 1,
	},
	list: {
		overflow: "scroll",
	},
});

export default Track;
