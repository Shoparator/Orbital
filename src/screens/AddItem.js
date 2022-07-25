import React, { useState, useContext } from "react";
import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	SafeAreaView,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";

import { db, auth } from "../firebase";
import { AuthButton, AuthTextInput } from "../components";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ThemeContext } from "../components/Contexts/ThemeManager";

const AddItem = ({ navigation }) => {
	// Store values for the fields
	const [name, setName] = useState("");
	const [url, setUrl] = useState("");
	const [warnPrice, setWarnPrice] = useState("");

	const { darkTheme } = useContext(ThemeContext);

	// Helper Functions
	const submitHandler = async () => {
		// Checks if fields are empty
		if (name.length === 0 || url.length === 0 || warnPrice.length == 0) {
			showRes("Fields cannot be empty!");
			return;
		}

		if (isNaN(warnPrice)) { // Ensures only numbers inputted in the field
			showRes("Notify At should contains numbers only.");
			return;
		}

		if (url.includes("lazada") || url.includes("shopee") || url.includes("amazon")) {
			// Attempt to add the listing to Firestore
			try {
				const taskRef = await addDoc(
					collection(db, "track", "users", auth.currentUser.uid),
					{
						name: name,
						url: url,
						price: [0, 0, 0, 0, 0],
						thresholdPrice: warnPrice,
						time: [0, 0, 0, 0, 0]
					}
				);
				clearForm();
				console.log("onSubmitHandler success", taskRef.id);
				showRes("Successfully added listing!");
			} catch (err) {
				console.log("onSubmitHandler failure", err);
				showRes("Failed to add listing!");
			}
		} else {
			showRes("App currently only supports Shopee, Lazada and Amazon");
		}
	};

	// Pop up to display message
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
			<StatusBar style={darkTheme ? "light" : "dark"} />
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : null}
			>
				<View style={styles.container}>
					<AuthTextInput
						value={name}
						placeholder="Item Name."
						textHandler={setName}
						icon={
							<MaterialIcons
								name="description"
								style={
									darkTheme
										? darkStyles.authImg
										: styles.authImg
								}
								size={20}
							/>
						}
						placeholderTextColor={darkTheme ? "#fff" : null}
						testID="name_field"
					/>

					<AuthTextInput
						value={url}
						placeholder="Item Url."
						textHandler={setUrl}
						icon={
							<MaterialIcons
								name="link"
								style={
									darkTheme
										? darkStyles.authImg
										: styles.authImg
								}
								size={20}
							/>
						}
						placeholderTextColor={darkTheme ? "#fff" : null}
						testID="url_field"
					/>

					<AuthTextInput
						value={warnPrice}
						placeholder="Notify At."
						textHandler={setWarnPrice}
						icon={
							<MaterialIcons
								name="attach-money"
								style={
									darkTheme
										? darkStyles.authImg
										: styles.authImg
								}
								size={20}
							/>
						}
						placeholderTextColor={darkTheme ? "#fff" : null}
						testID="threshold_field"
					/>

					<AuthButton title="Submit" onPressHandler={submitHandler} testID="submit_button" />
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
	},

	authImg: {
		marginRight: 5,
	},

	buttonText: { color: "#006ee6", fontWeight: "700" },
});

const darkStyles = StyleSheet.create({
	authImg: {
		marginRight: 5,
		color: "#fff",
	},
});

export default AddItem;
