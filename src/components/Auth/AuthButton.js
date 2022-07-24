import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";

const AuthButton = (props) => {
	const { onPressHandler, title, testID } = props;

	return (
		<Pressable
			style={styles.button}
			onPress={onPressHandler}
			android_ripple={{ color: "#FFF" }}
			testID={testID}
		>
			<Text style={styles.text}>{title}</Text>
		</Pressable>
	);
};

export default AuthButton;

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#006ee6",
		padding: 15,
		width: "100%",
		borderRadius: 10,
		marginBottom: 30,
	},
	text: {
		color: "white",
		textAlign: "center",
		fontWeight: "700",
		fontSize: 16,
	},
});
