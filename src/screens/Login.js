import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	ToastAndroid,
	Text,
	SafeAreaView,
	TouchableOpacity,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";

import { AuthButton, AuthTextInput } from "../components";
import { auth } from "../firebase";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";

const Login = ({ navigation }) => {
	// Store values that are typed
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Helper Fucntions

	// Android Only pop up
	const missingFieldsToast = () => {
		ToastAndroid.show(
			"Missing fields, please try again!",
			ToastAndroid.SHORT
		);
	};

	// Empties the fields and dismisses the keyboard
	const restoreForm = () => {
		setEmail("");
		setPassword("");
		Keyboard.dismiss();
	};

	// Function to handle the login
	const loginHandler = () => {
		// Checks if there is anything typed
		if (email.length === 0 || password.length === 0) {
			missingFieldsToast();
			return;
		}

		// Function from firebase to sign in
		return signInWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				restoreForm();
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error("[loginHandler]", errorCode, errorMessage);
			});
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

					<Text style={styles.header}> Login </Text>

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

					<AuthTextInput
						value={password}
						placeholder="Password."
						textHandler={setPassword}
						inputType="password"
						icon={
							<Ionicons
								name="ios-lock-closed-outline"
								size={20}
								color="#666"
								style={styles.authImg}
							/>
						}
						button={
							<TouchableOpacity
								onPress={() => navigation.navigate("Forget")}
							>
								<Text style={styles.buttonText}>Forget?</Text>
							</TouchableOpacity>
						}
					/>

					<AuthButton onPressHandler={loginHandler} title={"Login"} />

					<View
						style={{
							flexDirection: "row",
						}}
					>
						<Text style={{ marginRight: 5 }}>New to the App?</Text>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate("Register");
							}}
						>
							<Text style={styles.textButton}>Register</Text>
						</TouchableOpacity>
					</View>
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

export default Login;
