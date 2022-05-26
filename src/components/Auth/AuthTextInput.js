import { StyleSheet, TextInput, View } from "react-native";
import React from "react";

const AuthTextInput = (props) => {
	const {
		inputType,
		keyboardType,
		placeholder,
		value,
		textHandler,
		icon,
		button,
	} = props;

	return (
		<View style={styles.fields}>
			{icon}

			<TextInput
				style={styles.authInput}
				placeholder={placeholder}
				value={value}
				secureTextEntry={inputType == "password" ? true : false}
				onChangeText={textHandler}
				keyboardType={keyboardType}
			/>

			{button}
		</View>
	);
};

export default AuthTextInput;

const styles = StyleSheet.create({
	fields: {
		alignSelf: "flex-start",
		flexDirection: "row",
		borderBottomColor: "#ccc",
		borderBottomWidth: 1,
		paddingBottom: 5,
		marginBottom: 25,
	},

	authInput: {
		flex: 1,
		paddingVertical: 0,
	},
});
