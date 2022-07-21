import React, { useContext, useState } from "react";
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
import { signInWithEmailAndPassword } from "firebase/auth";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";

import { AuthButton, AuthTextInput } from "../components";
import { auth } from "../firebase";
import { ThemeContext } from "../components/ThemeManager";

const Login = ({ navigation }) => {
	// Store values that are typed
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { darkTheme } = useContext(ThemeContext);

	// Helper Fucntions

	const missingFieldsToast = () => {
		Toast.show("Missing fields, please try again!", {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
	};

	const loginFailedToast = () => {
		Toast.show("Login failed. Please check your email and password.", {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
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
				loginFailedToast();
			});
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
						Login
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
						button={
							<TouchableOpacity
								onPress={() => navigation.navigate("Forget")}
								testID="navigate_to_forget"
							>
								<Text style={styles.buttonText}>Forget?</Text>
							</TouchableOpacity>
						}
						testID="password_field"
					/>

					<AuthButton onPressHandler={loginHandler} title={"Login"} testID="login_button" />

					<View
						style={{
							flexDirection: "row",
						}}
					>
						<Text style={darkTheme ? darkStyles.text : styles.text}>
							New to the App?
						</Text>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate("Register");
							}}
							testID="navigate_to_register"
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

export default Login;
