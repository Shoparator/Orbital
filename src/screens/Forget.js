import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	Text,
	SafeAreaView,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import Toast from "react-native-root-toast";

import { AuthButton, AuthTextInput } from "../components";
import { auth } from "../firebase";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";

const Forget = ({ navigation }) => {
	const [email, setEmail] = useState("");

	const missingFieldsToast = () => {
		Toast.show("Missing fields, please try again!", {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
	};

	// Reset password through Firebase
	const resetHandler = () => {
		// Check if an email is typed
		if (email.length === 0) {
			missingFieldsToast();
			return;
		}

		return sendPasswordResetEmail(auth, email)
			.then(() => {
				restoreForm();
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;

				console.error("[resetHandler]", errorCode, errorMessage);
			});
	};

	const restoreForm = () => {
		setEmail("");
		Keyboard.dismiss();
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor="#E8EAED" />
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : null}
			>
				<View style={styles.container}>
					<Image
						style={styles.logo}
						source={require("../../assets/logo_transparent.png")}
					/>

					<Text style={styles.header}> Reset Password </Text>

					<AuthTextInput
						value={email}
						placeholder="Email."
						textHandler={setEmail}
						keyboardType="email-address"
						icon={
							<MaterialIcons
								name="alternate-email"
								size={20}
								color="#666"
								style={styles.authImg}
							/>
						}
					/>

					<AuthButton
						onPressHandler={resetHandler}
						title={"Reset Password"}
					/>
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
		paddingHorizontal: 25,
	},

	logo: {
		width: 300,
		height: 300,
		marginBottom: 10,
	},

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
});

export default Forget;
