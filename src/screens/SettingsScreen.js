import React, { useContext } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

import { ToggleButton } from "../components";
import { ThemeContext } from "../components/ThemeManager";

const SettingsScreen = ({ navigation }) => {
	const { darkTheme, toggleTheme } = useContext(ThemeContext);

	return (
		<SafeAreaView style={styles.home}>
			<StatusBar style={darkTheme ? "light" : "dark"} />
			<ToggleButton
				text={"Dark Mode"}
				onPress={toggleTheme}
				value={darkTheme}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	home: {
		// flex: 1,
		// justifyContent: "center",
		// alignItems: "center",
	},
});

export default SettingsScreen;
