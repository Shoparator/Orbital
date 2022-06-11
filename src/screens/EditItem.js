import React, { useState } from "react";
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

import { db, auth } from "../firebase";
import { TextInput, AuthButton } from "../components";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";

const EditItem = () => {
	const route = useRoute();
	const data = route.params.data;
	const [name, setName] = useState("");
	const [warnPrice, setWarnPrice] = useState("");

	const submitHandler = async () => {
		if (isNaN(warnPrice)) {
			showRes("Notify At should contains numbers only.");
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
				showRes("Successfully added listing!");
			} catch (err) {
				console.log("onSubmitHandler failure", err);
				showRes("Failed to add listing!");
			}
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

	const clearForm = () => {
		setName("");
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
						placeholder={data.name}
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
						value={warnPrice}
						placeholder={data.thresholdPrice}
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

export default EditItem;
