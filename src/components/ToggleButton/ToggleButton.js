import { useContext } from "react";
import { View, Switch, StyleSheet, Text } from "react-native";

import { ThemeContext } from "../Contexts/ThemeManager";

const ToggleButton = (props) => {
	const { text, value, onPress } = props;
	const { darkTheme } = useContext(ThemeContext);

	return (
		<View>
			<View style={styles.container}>
				<Text style={darkTheme ? darkStyles.text : styles.text} testID="toggle_button_text">
					{text}
				</Text>
				<Switch onValueChange={onPress} value={value} testID="toggle_button" />
			</View>
		</View>
	);
};

export default ToggleButton;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 18,

	},
	text: {
		justifyContent: "center",
		fontSize: 14,
		color: "#696969",
		fontWeight: "500"
	},
});

const darkStyles = StyleSheet.create({
	text: {
		justifyContent: "center",
		fontSize: 14,
		color: "#a9a9a9",
		fontWeight: "500"
	},
});
