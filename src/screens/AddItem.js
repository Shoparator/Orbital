import React, { useState } from "react";
import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	ToastAndroid,
} from "react-native";

import { addDoc, collection } from "firebase/firestore";

import { db, auth } from "../firebase";

import { TextInput } from "../components";

import { Button } from "react-native-ios-kit";

const AddItem = ({ navigation }) => {
	// Store values for the fields
	const [name, setName] = useState("");
	const [url, setUrl] = useState("");

	// Helper Functions
	const submitHandler = async () => {
		// Checks if fields are empty
		if (name.length === 0 || url.length === 0) {
			showRes("Fields cannot be empty!");
			return;
		}

		// Attempt to add the listing to Firestore
		try {
			const taskRef = await addDoc(collection(db, auth.currentUser.uid), {
				name: name,
				url: url,
				price: null,
			});
			clearForm();
			console.log("onSubmitHandler success", taskRef.id);
			showRes("Successfully added listing!");
		} catch (err) {
			console.log("onSubmitHandler failure", err);
			showRes("Failed to add listing!");
		}
	};

	// Android Only pop up
	const showRes = (text) => {
		ToastAndroid.show(text, ToastAndroid.SHORT);
	};

	// Clears fields and dismisses the keyboard
	const clearForm = () => {
		setName("");
		setUrl("");
		Keyboard.dismiss();
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : null}
		>
			<View style={styles.container}>
				<TextInput
					value={name}
					placeholder="Item Name."
					textHandler={setName}
				/>

				<TextInput
					value={url}
					placeholder="Item Url."
					textHandler={setUrl}
				/>

				<Button rounded inverted onPress={submitHandler}>
					Submit
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#E8EAED",
		alignItems: "center",
		justifyContent: "center",
	},
	button: {},
});

export default AddItem;
