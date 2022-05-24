import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	KeyboardAvoidingView,
	FlatList,
	ToastAndroid,
} from "react-native";
import {
	onSnapshot,
	query,
	collection,
	doc,
	deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import { Item } from "../components";
import ActionButton from "react-native-action-button";

const Track = ({ navigation }) => {
	const [listings, setListings] = useState([]);

	useEffect(() => {
		// Expensive operation. Consider your app's design on when to invoke this.
		// Could use Redux to help on first application load.
		const taskQuery = query(collection(db, "listings"));

		const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
			const listings = [];

			snapshot.forEach((doc) => {
				listings.push({ id: doc.id, ...doc.data() });
			});

			setListings([...listings]);
		});

		return unsubscribe;
	});

	const showRes = (text) => {
		ToastAndroid.show(text, ToastAndroid.SHORT);
	};

	const onDeleteHandler = async (id) => {
		try {
			await deleteDoc(doc(db, "listings", id));

			console.log("onDeleteHandler success", id);
			showRes("Successfully deleted task!");
		} catch (err) {
			console.log("onDeleteHandler failure", err);
			showRes("Failed to delete task!");
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : null}
		>
			<SafeAreaView style={styles.container}>
				<View style={styles.contentContainer}>
					<View style={styles.listContainer}>
						<FlatList
							data={listings}
							renderItem={({ item, index }) => (
								<Item
									data={item}
									key={index}
									onDelete={onDeleteHandler}
								/>
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
		backgroundColor: "#FAF9F6",
	},
	contentContainer: {
		flex: 1,
		backgroundColor: "#FAF9F6",
	},
	listContainer: {
		flex: 1,
		paddingBottom: 70,
	},
	list: {
		overflow: "scroll",
	},
});

export default Track;
