import React, { useState, useContext } from "react";
import {
	StyleSheet,
	View,
	Image,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	Text,
	SafeAreaView,
	TouchableOpacity,
} from "react-native";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-root-toast";

import { AuthButton, AuthTextInput } from "../components";
import { auth } from "../firebase";
import { ThemeContext } from "../components/Contexts/ThemeManager";

const Register = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { darkTheme } = useContext(ThemeContext);

	// Pop ups to display message
	const showRes = (message) => {
		Toast.show(message, {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
	}

	// Helper Fucntions
	const signUpHandler = () => {
		if (email.length === 0 || password.length === 0) {
			showRes("Missing fields, please try again!");
			return;
		}

		if (password != confirmPassword) {
			showRes("Password must be the same!");
			return;
		}

		// Use Firebase function to create an account
		return createUserWithEmailAndPassword(auth, email, password)
			.then(() => {
				restoreForm();
				sendEmailVerification(auth.currentUser);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;

				console.error("[signUpHandler]", errorCode, errorMessage);
			});
	};

	// Clears fields and dismisses keyboard
	const restoreForm = () => {
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		Keyboard.dismiss();
	};

	return (
		<SafeAreaView
			style={darkTheme ? darkStyles.container : styles.container}
		>
			<StatusBar style={darkTheme ? "light" : "dark"} />
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : null}
			>
				<View
					style={darkTheme ? darkStyles.container : styles.container}
				>
					<Image
						style={styles.logo}
						source={require("../../assets/logo_transparent.png")}
						testID="logo"
					/>

					<Text style={darkTheme ? darkStyles.header : styles.header} testID="header">
						Register
					</Text>

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
						testID="email_field"
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
						testID="password_field"
					/>

					<AuthTextInput
						value={confirmPassword}
						placeholder="Confirm Password."
						textHandler={setConfirmPassword}
						inputType="password"
						icon={
							<Ionicons
								name="ios-lock-closed-outline"
								size={20}
								color="#666"
								style={styles.authImg}
							/>
						}
						testID="repeat_password_field"
					/>

					<AuthButton
						onPressHandler={signUpHandler}
						title={"Register"}
						testID="register_button"
					/>

					<View
						style={{
							flexDirection: "row",
						}}
					>
						<Text style={darkTheme ? darkStyles.text : styles.text}>
							Already have an account?
						</Text>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate("Login");
							}}
							testID="navigate_to_login"
						>
							<Text style={styles.textButton}>Login</Text>
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

	text: {
		marginRight: 5,
	},
});

const darkStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 25,
	},

	header: {
		fontSize: 28,
		fontWeight: "500",
		color: "#fff",
		marginBottom: 30,
		alignSelf: "flex-start",
	},

	text: {
		marginRight: 5,
		color: "#fff",
	},
});

export default Register;
