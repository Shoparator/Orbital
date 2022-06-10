import React, { useState, useEffect, useLayoutEffect } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	KeyboardAvoidingView,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { onSnapshot, query, collection } from "firebase/firestore";
import ActionButton from "react-native-action-button";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { db, auth } from "../firebase";
import { ItemButton, SearchBar } from "../components";

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

	// Refreshes the list by triggering the above
	const refresh = () => {
		setIsRefresh(true);
		setIsRefresh(false);
	};

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
