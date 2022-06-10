import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { jsdom } from "jsdom-jscore-rn";
import axios from "axios";

import { auth, db } from "../../firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

const ItemImage = (props) => {
	const { data } = props;

	const updateData = async (url) => {
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
			try {
				const price = jsdom(html)
					.querySelector("#module_product_price_1")
					.textContent.split("$")[1]
					.replace(",", "");

				if (price != data.price1) {
					const ref = doc(
						db,
						"track",
						"users",
						auth.currentUser.uid,
						data.id
					);
					await updateDoc(ref, {
						price1: price,
						time1: Timestamp.now(),
					});
				}
			} catch (e) {
				console.log("Failed to scrape price from Lazada");
			}

			try {
				const imgUrl = jsdom(html).querySelectorAll(
					".gallery-preview-panel img"
				)[0].src;

				if (imgUrl != data.imgUrl) {
					const ref = doc(
						db,
						"track",
						"users",
						auth.currentUser.uid,
						data.id
					);
					await updateDoc(ref, {
						imgUrl: imgUrl,
					});
				}
			} catch (e) {
				console.log("Failed to scrape image from Lazada");
			}
		}
		if (url.includes("amazon")) {
			try {
				const price = jsdom(html)
					.querySelector("#corePrice_desktop")
					.textContent.split("$")[3];
				if (price != data.price1) {
					const ref = doc(
						db,
						"track",
						"users",
						auth.currentUser.uid,
						data.id
					);
					await updateDoc(ref, {
						price1: price,
						time1: Timestamp.now(),
					});
				}
			} catch (e) {
				console.log("Failed to scrape price from Amazon");
			}

			try {
				const imgUrl =
					jsdom(html).querySelector(".imgTagWrapper img").src;

				if (imgUrl != data.imgUrl) {
					const ref = doc(
						db,
						"track",
						"users",
						auth.currentUser.uid,
						data.id
					);
					await updateDoc(ref, {
						imgUrl: imgUrl,
					});
				}
			} catch (e) {
				console.log("Failed to scrape image from Amazon");
			}
		}
	};

	// useEffect(() => {
	// 	updateData(data.url);
	// }, []);

	return (
		<View style={styles.container}>
			<View>
				<Image style={styles.logo} source={{ uri: data.imgUrl }} />
			</View>
			<View style={styles.rightContainer}>
				<Text style={styles.text}>{data.name}</Text>
				<Text style={styles.text}>{"$" + data.price1}</Text>
				<Text style={styles.text}>
					{"Notify At: $" + data.thresholdPrice}
				</Text>
			</View>
		</View>
	);
};

export default ItemImage;

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
	},
	text: {
		fontWeight: "bold",
		marginRight: 10,
		fontSize: 20,
	},

	logo: {
		width: 150,
		height: 150,
		margin: 10,
	},
});
