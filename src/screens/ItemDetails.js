import React, { useLayoutEffect, useContext } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Linking,
	SafeAreaView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { deleteDoc, doc } from "firebase/firestore";
import ActionButton from "react-native-action-button";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";
import PureChart from 'react-native-pure-chart';

import { AuthButton, ItemImage } from "../components";
import { db, auth } from "../firebase";
import { ThemeContext } from "../components/Contexts/ThemeManager";

const ItemDetails = () => {
	const route = useRoute();
	const navigation = useNavigation();
	const data = route.params.data;
	const { darkTheme } = useContext(ThemeContext);

	// Add delete icon on the header
	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => onDeleteHandler(data.id)} testID="delete_button" >
					<MaterialIcons
						name="delete"
						size={30}
						color="rgba(10,132,255,1)"
					/>
				</TouchableOpacity>
			),
		});
	}, []);

	// Function of the delete icon
	const onDeleteHandler = async (id) => {
		try {
			await deleteDoc(
				doc(db, "track", "users", auth.currentUser.uid, id)
			);

			console.log("onDeleteHandler success", id);
			Toast.show("Successfully deleted task!", {
				duration: Toast.durations.SHORT,
				backgroundColor: "#fff",
				textColor: "black",
				position: Toast.positions.CENTER - 50,
			});
			navigation.navigate("Currently Tracking");
		} catch (err) {
			console.log("onDeleteHandler failure", err);
			Toast.show("Failed to delete task!", {
				duration: Toast.durations.SHORT,
				backgroundColor: "#fff",
				textColor: "black",
				position: Toast.positions.CENTER - 50,
			});
		}
	};

	const chartData = [
		{x: data.time[4], y: parseFloat(data.price[4])},
		{x: data.time[3], y: parseFloat(data.price[3])},
		{x: data.time[2], y: parseFloat(data.price[2])},
		{x: data.time[1], y: parseFloat(data.price[1])},
		{x: data.time[0], y: parseFloat(data.price[0])}
	];

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style={darkTheme ? "light" : "dark"} />
			<View>
				<ItemImage data={data} />
			</View>
			<View style={{padding:10, marginBottom:10}}>
				<PureChart data={chartData} type='line' testID="chart" />
			</View>
			<View>
				<AuthButton
					onPressHandler={() => {
						Linking.openURL(data.url);
					}}
					title="Go to Product Page"
					testID="redirect_button"
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
				onPress={() => navigation.navigate("Edit Item", { data: data })}
				testID="navigate_to_edit_item"
			/>
		</SafeAreaView>
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
