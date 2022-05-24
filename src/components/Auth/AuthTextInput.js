import {
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity,
	Text,
} from "react-native";
import React from "react";

const THEME = "#3F3F3F";

const AuthTextInput = (props) => {
	const {
		inputType,
		keyboardType,
		placeholder,
		value,
		textHandler,
		icon,
		fieldButtonLabel,
		fieldButtonFunction,
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

			<TouchableOpacity onPress={fieldButtonFunction}>
				<Text style={styles.buttonText}>{fieldButtonLabel}</Text>
			</TouchableOpacity>
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

	authImg: {
		marginRight: 5,
	},

	buttonText: { color: "#006ee6", fontWeight: "700" },
});
