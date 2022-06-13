import React, { useState, useEffect, useLayoutEffect } from "react";
import {
	StyleSheet,
	View,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { onSnapshot, query, collection } from "firebase/firestore";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { db, auth } from "../firebase";
import { ItemButton, SearchBar } from "../components";

const Track = ({ navigation }) => {
	const [listings, setListings] = useState([]);
	const [searchPhrase, setSearchPhrase] = useState("");
	const [clicked, setClicked] = useState(false);

	// useLayoutEffect(() => {
	// 	navigation.setOptions({
	// 		headerRight: () => (
	// 			<TouchableOpacity onPress={refresh}>
	// 				<MaterialIcons name="refresh" size={30} color="#407BFF" />
	// 			</TouchableOpacity>
	// 		),
	// 	});
	// }, []);

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
	}, []);

	return (
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
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 100,
		marginHorizontal: 10,
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
