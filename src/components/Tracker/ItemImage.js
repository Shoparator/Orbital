import React, { useContext } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { ThemeContext } from "../Contexts/ThemeManager";

const ItemImage = (props) => {
	const { data } = props;
	const { darkTheme } = useContext(ThemeContext);

	return (
		<View style={darkTheme ? darkStyles.container : styles.container}>
			<View>
				<Image style={styles.logo} source={{ uri: data.imgUrl }} testID="image" />
			</View>
			<View style={styles.rightContainer}>
				<Text style={darkTheme ? darkStyles.text : styles.text} testID="name">
					Name: {data.name}
				</Text>
				<Text style={darkTheme ? darkStyles.text : styles.text} testID="price">
					Current Price: {"$" + data.price[0]}
				</Text>
				<Text style={darkTheme ? darkStyles.text : styles.text} testID="threshold_price">
					Notify At: ${data.thresholdPrice}
				</Text>
			</View>
		</View>
	);
};

export default ItemImage;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		margin: 10,
		borderWidth: 1,
		borderColor: "#d1d1d1",
		borderRadius: 10,
		backgroundColor: "#fff",
	},
	rightContainer: {
		padding: 10,
		alignSelf: "center",
		flex: 1,
	},
	text: {
		fontWeight: "bold",
		marginRight: 10,
		fontSize: 14,
		marginBottom: 4,
	},
	logo: {
		width: 150,
		height: 150,
		margin: 10,
	},
});

const darkStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
		margin: 10,
		borderWidth: 1,
		borderColor: "#d1d1d1",
		borderRadius: 10,
		backgroundColor: "#080808",
	},
	text: {
		fontWeight: "bold",
		marginRight: 10,
		fontSize: 14,
		marginBottom: 4,
		color: "#fff",
	},
});
