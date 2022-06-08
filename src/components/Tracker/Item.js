import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { jsdom } from "jsdom-jscore-rn";
import axios from "axios";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Task = (props) => {
	const { data, onDelete } = props;

	const getPrice = async (url) => {
		const { data: html } = await axios
			.get(url, {
				headers: {
					Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
					"Accept-Encoding": "gzip",
					"Accept-Language": "en-US,en;q=0.9,es;q=0.8",
					"Upgrade-Insecure-Requests": "1",
					"User-Agent":
						"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
					Referer: "https://www.google.com/",
				},
			})
			.catch((err) => console.error(err));
		if (url.includes("lazada")) {
			const price = jsdom(html).querySelector(
				"#module_product_price_1"
			).textContent;

			if (price != data.price) {
				const ref = doc(db, auth.currentUser.uid, data.id);
				await updateDoc(ref, {
					price: price,
				});
			}
		}
		if (url.includes("amazon")) {
			const price =
				"$" +
				jsdom(html)
					.querySelector("#corePrice_desktop")
					.textContent.split("$")[1];

			if (price != data.price) {
				const ref = doc(db, auth.currentUser.uid, data.id);
				await updateDoc(ref, {
					price: price,
				});
			}
		}
	};

	getPrice(data.url);

	const DeleteIcon = () => (
		<TouchableOpacity onPress={() => onDelete(data.id)}>
			<MaterialIcons name="delete" size={28} color="#407BFF" />
		</TouchableOpacity>
	);

	return (
		<View style={[styles.container, styles.containerShadow]}>
			<Text style={styles.text}>{data.name}</Text>
			<Text style={styles.text}>{data.url}</Text>
			<Text style={styles.text}>{data.price}</Text>
			<DeleteIcon />
		</View>
	);
};

export default Task;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#E0D4B0",
		flexDirection: "row",
		marginHorizontal: 14,
		marginVertical: 10,
		paddingVertical: 10,
		paddingHorizontal: 6,
		alignItems: "center",
		borderRadius: 4,
	},
	containerShadow: {
		shadowColor: "#171717",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 5,
	},
	text: {
		fontWeight: "bold",
		flex: 1,
		flexWrap: "wrap",
		marginRight: 10,
	},
});
