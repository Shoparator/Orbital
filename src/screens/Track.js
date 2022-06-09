import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	KeyboardAvoidingView,
	FlatList,
	ToastAndroid,
	TouchableOpacity,
} from "react-native";
import {
	onSnapshot,
	query,
	collection,
	doc,
	deleteDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase";

import { Item } from "../components";
import ActionButton from "react-native-action-button";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Track = ({ navigation }) => {
	const [listings, setListings] = useState([]);
	const [isRefresh, setIsRefresh] = useState(false);

	// Helper Functions
	useEffect(() => {
		// Retrieve the data stored in firestore and stores in listings array
		const taskQuery = query(collection(db, auth.currentUser.uid));

		const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
			const listings = [];

			snapshot.forEach((doc) => {
				listings.push({ id: doc.id, ...doc.data() });
			});

			setListings([...listings]);
		});
		return unsubscribe;
	}, [refresh]);

	// Refreshes the list by triggering the above
	const refresh = () => {
		setIsRefresh(true);
		setIsRefresh(false);
	};

	// Android Only pop up
	const showRes = (text) => {
		ToastAndroid.show(text, ToastAndroid.SHORT);
	};

	// Deletes the listing
	const onDeleteHandler = async (id) => {
		try {
			// Use function from firestore.
			await deleteDoc(doc(db, auth.currentUser.uid, id));

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
						<TouchableOpacity
							onPress={refresh}
							style={{ alignSelf: "flex-end", padding: 10 }}
						>
							<MaterialIcons
								name="refresh"
								size={28}
								color="#407BFF"
							/>
						</TouchableOpacity>
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
	},
	contentContainer: {
		flex: 1,
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
