import React, { useState } from "react";
import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	SafeAreaView,
} from "react-native";
import { addDoc, collection, doc, Timestamp } from "firebase/firestore";
import Toast from "react-native-root-toast";

import { db, auth } from "../firebase";
import { AuthButton, TextInput } from "../components";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AddItem = ({ navigation }) => {
	// Store values for the fields
	const [name, setName] = useState("");
	const [url, setUrl] = useState("");
	const [warnPrice, setWarnPrice] = useState("");

	// Helper Functions
	const submitHandler = async () => {
		// Checks if fields are empty
		if (name.length === 0 || url.length === 0) {
			showRes("Fields cannot be empty!");
			return;
		}

		// Attempt to add the listing to Firestore
		try {
			const taskRef = await addDoc(
				doc(db, "track", "users", auth.currentUser.uid),
				{
					name: name,
					url: url,
					price1: null,
					price2: 0,
					price3: 0,
					price4: 0,
					price5: 0,
					thresholdPrice: warnPrice,
					time1: Timestamp.now(),
					time2: Timestamp.now(),
					time3: Timestamp.now(),
					time4: Timestamp.now(),
					time5: Timestamp.now(),
				}
			);
			clearForm();
			console.log("onSubmitHandler success", taskRef.id);
			showRes("Successfully added listing!");
		} catch (err) {
			console.log("onSubmitHandler failure", err);
			showRes("Failed to add listing!");
		}
	};

	const showRes = (text) => {
		Toast.show(text, {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
	};

	// Clears fields and dismisses the keyboard
	const clearForm = () => {
		setName("");
		setUrl("");
		setWarnPrice("");
		Keyboard.dismiss();
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : null}
			>
				<View style={styles.container}>
					<TextInput
						value={name}
						placeholder="Item Name."
						textHandler={setName}
						icon={
							<MaterialIcons
								name="description"
								style={styles.authImg}
								size={20}
							/>
						}
					/>

					<TextInput
						value={url}
						placeholder="Item Url."
						textHandler={setUrl}
						icon={
							<MaterialIcons
								name="link"
								style={styles.authImg}
								size={20}
							/>
						}
					/>

					<TextInput
						value={warnPrice}
						placeholder="Notify At."
						textHandler={setWarnPrice}
						icon={
							<MaterialIcons
								name="attach-money"
								style={styles.authImg}
								size={20}
							/>
						}
					/>

					<AuthButton title="Submit" onPressHandler={submitHandler} />
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#E8EAED",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
	},

	authImg: {
		marginRight: 5,
	},

	header: {
		fontSize: 28,
		fontWeight: "500",
		color: "#333",
		marginBottom: 30,
		alignSelf: "flex-start",
	},

	textButton: {
		color: "#006ee6",
		fontWeight: "700",
	},

	buttonText: { color: "#006ee6", fontWeight: "700" },
});

export default AddItem;
