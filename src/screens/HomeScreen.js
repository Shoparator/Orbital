import React, { useState } from "react";
import { StyleSheet } from "react-native";
import SearchBar from "../components/Searchbar/SearchBar";

const HomeScreen = ({ navigation }) => {
	const [searchPhrase, setSearchPhrase] = useState("");
	const [clicked, setClicked] = useState(false);

	return (
		<SearchBar
			searchPhrase={searchPhrase}
			setSearchPhrase={setSearchPhrase}
			clicked={clicked}
			setClicked={setClicked}
		/>
	);
};

const styles = StyleSheet.create({
	home: {
		flex: 1,
		justifyContent: "flex-top",
		alignItems: "center",
	},
});

export default HomeScreen;
