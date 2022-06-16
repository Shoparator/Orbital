import React, { useLayoutEffect, useContext } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Linking,
	Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useNavigation, useRoute } from "@react-navigation/native";
import { deleteDoc, doc } from "firebase/firestore";
import ActionButton from "react-native-action-button";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";

import { AuthButton, ItemImage } from "../components";
import { db, auth } from "../firebase";
import { ThemeContext } from "../components/ThemeManager";

const ItemDetails = () => {
	const route = useRoute();
	const navigation = useNavigation();
	const data = route.params.data;
	const screenWidth = Dimensions.get("window").width;
	const { darkTheme } = useContext(ThemeContext);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => onDeleteHandler(data.id)}>
					<MaterialIcons
						name="delete"
						size={30}
						color="rgba(10,132,255,1)"
					/>
				</TouchableOpacity>
			),
		});
	}, []);

	const onDeleteHandler = async (id) => {
		try {
			await deleteDoc(
				doc(db, "track", "users", auth.currentUser.uid, id)
			);

			console.log("onDeleteHandler success", id);
			showRes("Successfully deleted task!");
			navigation.navigate("Currently Tracking");
		} catch (err) {
			console.log("onDeleteHandler failure", err);
			showRes("Failed to delete task!");
		}
	};

	const showRes = (text) => {
		Toast.show(text, {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
	};

	const chartConfig = {
		backgroundGradientFromOpacity: 0,
		backgroundGradientToOpacity: 0,
		color: (opacity = 1) =>
			darkTheme
				? `rgba(255,255,255, ${opacity})`
				: `rgba(0,0,0, ${opacity})`,
		barPercentage: 0.5,
	};

	const chartData = {
		labels: [
			data.time1.toDate().toLocaleDateString("en-SG"),
			data.time2.toDate().toLocaleDateString("en-SG"),
			data.time3.toDate().toLocaleDateString("en-SG"),
			data.time4.toDate().toLocaleDateString("en-SG"),
			data.time5.toDate().toLocaleDateString("en-SG"),
		],
		datasets: [
			{
				data: [1, 2, 3, 4, 5],
				color: (opacity = 1) => `rgba(10,132,255, ${opacity})`, // optional
				strokeWidth: 2, // optional
			},
		],
	};

	const onPress = () => {
		navigation.navigate("Edit Item", { data: data });
	};

	return (
		<View style={styles.container}>
			<StatusBar style={darkTheme ? "light" : "dark"} />
			<View>
				<ItemImage data={data} />
			</View>
			<View>
				<LineChart
					data={chartData}
					width={screenWidth}
					height={220}
					chartConfig={chartConfig}
					style={{ marginRight: 40 }}
				/>
			</View>
			<View>
				<AuthButton
					onPressHandler={() => {
						Linking.openURL(data.url);
					}}
					title="Go to Product Page"
				/>
			</View>
			<ActionButton
				icon={
					<MaterialIcons
						name="edit"
						style={styles.actionButtonIcon}
					/>
				}
				buttonColor="rgba(10,132,255,1)"
				onPress={onPress}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 10,
	},

	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: "white",
	},
});

export default ItemDetails;
