import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { jsdom } from "jsdom-jscore-rn";
import axios from "axios";

import { auth, db } from "../../firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { ThemeContext } from "../ThemeManager";

const ItemImage = (props) => {
	const { data } = props;
	const { darkTheme } = useContext(ThemeContext);

	const updateData = async (url) => {
		if (url.includes("lazada")) {
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
			try {
				let price = jsdom(html)
					.querySelector("#module_product_price_1")
					.textContent.split("$")[1]
					.replace(",", "");
				let time = Timestamp.now().toDate().toLocaleDateString("en-sg").substring(0, 5).replace("/", "-") + " " + Timestamp.now().toDate().toLocaleTimeString().substring(0, 5);

				console.log(price);
				console.log(time);

				let priceArray = data.price;
				let timeArray = data.time;
				let tempPrice = "";
				let tempTime = "";

				console.log(priceArray);
				console.log(timeArray);

				for (let i = 0; i < priceArray.length; i = i+1) {
					tempPrice = priceArray[i];
					tempTime = timeArray[i];
					priceArray[i] = price;
					timeArray[i] = time
					price = tempPrice
					time = tempTime;
				}

				console.log(priceArray);
				console.log(timeArray);

				const ref = doc(
					db,
					"track",
					"users",
					auth.currentUser.uid,
					data.id
				);
				await updateDoc(ref, {
					price: priceArray,
					time: timeArray,
				});
			} catch (e) {
				console.log(e);
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
		
	};

	useEffect(() => {
		updateData(data.url);
	}, []);

	return (
		<View style={darkTheme ? darkStyles.container : styles.container}>
			<View>
				<Image style={styles.logo} source={{ uri: data.imgUrl }} />
			</View>
			<View style={styles.rightContainer}>
				<Text style={darkTheme ? darkStyles.text : styles.text}>
					Name: {data.name}
				</Text>
				<Text style={darkTheme ? darkStyles.text : styles.text}>
					Current Price: {"$" + data.price[0]}
				</Text>
				<Text style={darkTheme ? darkStyles.text : styles.text}>
					Notify At: ${data.thresholdPrice}
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
		flex: 1,
	},
	text: {
		fontWeight: "bold",
		marginRight: 10,
		fontSize: 14,
		marginBottom: 4,
	},
	logo: {
		width: 150,
		height: 150,
		margin: 10,
	},
});

const darkStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
		margin: 10,
		borderWidth: 1,
		borderColor: "#d1d1d1",
		borderRadius: 10,
		backgroundColor: "#080808",
	},
	text: {
		fontWeight: "bold",
		marginRight: 10,
		fontSize: 14,
		marginBottom: 4,
		color: "#fff",
	},
});
