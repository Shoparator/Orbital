import { useContext } from "react";
import { View, Switch, StyleSheet, Text } from "react-native";

import { ThemeContext } from "../ThemeManager";

const ToggleButton = (props) => {
	const { text, value, onPress } = props;
	const { darkTheme } = useContext(ThemeContext);

	return (
		<View>
			<View style={styles.container}>
				<Text style={darkTheme ? darkStyles.text : styles.text}>
					{text}
				</Text>
				<Switch onValueChange={onPress} value={value} />
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
		paddingHorizontal: 20,
		borderBottomColor: "#AEC6CF",
		borderBottomWidth: 1,
	},
	text: {
		justifyContent: "center",
		fontSize: 16,
	},
});

const darkStyles = StyleSheet.create({
	text: {
		justifyContent: "center",
		fontSize: 16,
		color: "#fff",
	},
});
