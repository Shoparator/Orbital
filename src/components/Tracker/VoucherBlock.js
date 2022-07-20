import React, { useContext } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { ThemeContext } from "../ThemeManager";

const VoucherBlock = (props) => {
	const { data, shop } = props;
	const { darkTheme } = useContext(ThemeContext);

	const info = data.split("/");

	const bankIcon = (info[0].includes("HSBC") ? require("../../../assets/HSBC.png") 
					: info[0].includes("UOB") ? require("../../../assets/UOB.png")
					: info[0].includes("DBS") ? require("../../../assets/DBS.png")
					: info[0].includes("ICBC") ? require("../../../assets/ICBC.png")
					: info[0].includes("CIMB") ? require("../../../assets/CIMB.png")
					: require("../../../assets/Citi.png"));

	return (
		<View style={darkTheme ? darkStyles.container : styles.container}>
			<View style={{backgroundColor: "rgb(10, 148, 244)", justifyContent: "center", borderRadius: 10}}>
				<View style={styles.logo}>
					{info[0].includes("Voucher") 
						? <Image source={bankIcon} style={{flex: 1, width: undefined, height: undefined, resizeMode: 'contain'}} />
						: <Text style={styles.categoryText}>
							{info[0]}
						</Text>
					}
				</View>
			</View>
			
			<View style={styles.rightContainer}>
				<Text style={styles.value}>
					{info[1]}
				</Text>
				<Text style={styles.conditions}>
					{info[2]}
				</Text>
				<Text style={styles.expiry}>
					{info[3]}
				</Text>
				<Text style={styles.text}>
					{info[4]}
				</Text>
			</View>
		</View>
	);
};

export default VoucherBlock;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		margin: 10,
		borderWidth: 1,
		borderColor: "#d1d1d1",
		borderRadius: 10,
		backgroundColor: "#fff",
	},
	rightContainer: {
		padding: 10,
		alignSelf: "center",
		flex: 1,
		justifyContent: "center",
	},
	categoryText: {
		alignSelf: "center",
		position: "absolute",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 14
	},
	text: {
		fontWeight: "bold",
		marginRight: 10,
		fontSize: 12,
		marginBottom: 4,
	},
	value: {
		fontWeight: "bold",
		marginRight: 10,
		fontSize: 32,
		marginBottom: 4,
	},
	conditions: {
		fontWeight: "bold",
		marginRight: 10,
		fontSize: 14,
		marginBottom: 4,
	},
	expiry: {
		fontWeight: "bold",
		marginRight: 10,
		fontSize: 12,
		marginBottom: 4,
	},
	logo: {
		width: 100,
		height: 100,
		padding: 10,
		justifyContent: "center",
		alignSelf: "center"
	},
});

const darkStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
		margin: 10,
		borderRadius: 10,
		backgroundColor: "#fff",
	},
});
