import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ToggleButton } from "../components";
import { ThemeContext } from "../components/ThemeManager";

const SettingsScreen = ({ navigation }) => {
	const { darkTheme, toggleTheme } = useContext(ThemeContext);

	return (
		<View style={styles.home}>
			<ToggleButton
				text={"Dark Mode"}
				onPress={toggleTheme}
				value={darkTheme}
			/>
		</View>
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
