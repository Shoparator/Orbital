import React, { useContext } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemeContext } from "../Contexts/ThemeManager";

const AuthTextInput = (props) => {
	const {
		inputType,
		keyboardType,
		placeholder,
		value,
		textHandler,
		icon,
		button,
		testID
	} = props;

	const { darkTheme } = useContext(ThemeContext);

	return (
		<View style={styles.fields}>
			{icon}

			<TextInput
				style={darkTheme ? darkStyles.authInput : styles.authInput}
				placeholder={placeholder}
				value={value}
				secureTextEntry={inputType == "password" ? true : false}
				onChangeText={textHandler}
				keyboardType={keyboardType}
				placeholderTextColor={darkTheme ? "#fff" : null}
				testID={testID}
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

const darkStyles = StyleSheet.create({
	authInput: {
		flex: 1,
		paddingVertical: 0,
		color: "#fff",
	},
});
