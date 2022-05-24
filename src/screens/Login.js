import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	ToastAndroid,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";

import { AuthButton, AuthTextInput } from "../components";
import { auth } from "../firebase";

const Login = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const missingFieldsToast = () => {
		ToastAndroid.show(
			"Missing fields, please try again!",
			ToastAndroid.SHORT
		);
	};

	const loginHandler = () => {
		if (email.length === 0 || password.length === 0) {
			missingFieldsToast();
			return;
		}

		return signInWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;

				// To show the user object returned
				console.log(user);

				restoreForm();
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;

				console.error("[loginHandler]", errorCode, errorMessage);
			});
	};

	const restoreForm = () => {
		setEmail("");
		setPassword("");
		Keyboard.dismiss();
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : null}
		>
			<View style={styles.container}>
				<Image
					style={styles.logo}
					source={require("../../assets/logo_transparent.png")}
				/>

				<AuthTextInput
					value={email}
					placeholder="Email."
					textHandler={setEmail}
					keyboardType="email-address"
				/>

				<AuthTextInput
					value={password}
					placeholder="Password."
					textHandler={setPassword}
					secureTextEntry
				/>

				<AuthButton onPressHandler={loginHandler} title={"Proceed"} />
				<AuthButton
					onPressHandler={() => {
						navigation.navigate("Register");
					}}
					title={`Switch to Sign Up`}
				/>
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

	logo: {
		width: 300,
		height: 300,
		marginBottom: 40,
	},
});

export default Login;
