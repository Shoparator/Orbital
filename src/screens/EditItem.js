import React, { useState, useContext } from "react";
import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	SafeAreaView,
} from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import Toast from "react-native-root-toast";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { db, auth } from "../firebase";
import { AuthButton, AuthTextInput } from "../components";
import { ThemeContext } from "../components/Contexts/ThemeManager";

const EditItem = () => {
	const route = useRoute();
	const data = route.params.data;
	const [name, setName] = useState("");
	const [warnPrice, setWarnPrice] = useState("");
	const { darkTheme } = useContext(ThemeContext);

	// Submits changes to firebase database
	const submitHandler = async () => {
		if (isNaN(warnPrice)) { // Ensures only numbers inputted in the field
			showRes("Notify At should contains numbers only.");
			return;
		}
		if (warnPrice.length == 0 && name.length == 0) {
			showRes("Fields must not be empty to make changes.");
			return;
		}
		if (name.length > 0 || warnPrice.length > 0) {
			try {
				const ref = doc(
					db,
					"track",
					"users",
					auth.currentUser.uid,
					data.id
				);
				await updateDoc(ref, {
					name: name == "" ? data.name : name,
					thresholdPrice:
						warnPrice == "" ? data.thresholdPrice : warnPrice,
				});
				clearForm();
				console.log("onSubmitHandler success", ref.id);
				showRes("Successfully edited listing!");
			} catch (err) {
				console.log("onSubmitHandler failure", err);
				showRes("Failed to edit listing!");
			}
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

	// Clears all fields and dismisses keyboard
	const clearForm = () => {
		setName("");
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
						placeholder={data.name}
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
						testID="name"
					/>
					<AuthTextInput
						value={warnPrice}
						placeholder={data.thresholdPrice}
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
						testID="threshold_price"
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

const darkStyles = StyleSheet.create({
	authImg: {
		marginRight: 5,
		color: "#fff",
	},
});

export default EditItem;
