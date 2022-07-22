import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, SafeAreaView, FlatList, TouchableOpacity, Text, Image } from "react-native";
import { onSnapshot, query, doc } from "firebase/firestore";
import { StatusBar } from "expo-status-bar";

import { db } from "../firebase";
import { VoucherBlock } from "../components";
import { ThemeContext } from "../components/Contexts/ThemeManager";

const Coupon = ({ navigation }) => {
	const [ lazadaVouchers, setLazadaVouchers ] = React.useState([]);
	const [ shopeeVouchers, setShopeeVouchers ] = React.useState([]);
	const [ time, setTime ] = React.useState("");
	const { darkTheme } = useContext(ThemeContext);
	const [selected, setSelected] = useState("lazada");

	// Helper Functions
	useEffect(() => {
		// Retrieve the data stored in firestore
		const vouchersQuery = query(
			doc(db, "track", "vouchers")
		);

		const unsubscribe = onSnapshot(vouchersQuery, (snapshot) => {
			const vouchers = snapshot.data();
			setLazadaVouchers(vouchers.lazada);
			setShopeeVouchers(vouchers.shopee);
			setTime(vouchers.time);
		});
		return unsubscribe;
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style={darkTheme ? "light" : "dark"} />
			<View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
				<TouchableOpacity onPress={() => setSelected("lazada")} testID="lazada_button">
					<View style = {styles.button}>
						<Image source={require("../../assets/lazada.png")} style={{width: 95, height: 25, margin: 5}} />
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => setSelected("shopee")} testID="shopee_button">
					<View style={styles.button}>
						<Image source={require("../../assets/shopee.png")} style={{width: 71, height: 25, margin: 5}} />
					</View>
				</TouchableOpacity>
			</View>
				<Text style={{alignSelf: "flex-end", paddingTop: 5, color: darkTheme ? "#fff" : "#000000"}} testID="time">
					Last Updated: {time}
				</Text>
			<View style={styles.contentContainer}>
				<View style={styles.listContainer}>
					<FlatList
						data={selected == "lazada" ? lazadaVouchers : shopeeVouchers}
						renderItem={({ item, index }) => (
							<VoucherBlock data={item} shop={selected} key={index}/>
						)}
						style={styles.list}
						showsVerticalScrollIndicator={false}
						testID="voucher_list"
					/>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 100,
		marginHorizontal: 10,
	},
	contentContainer: {
		flex: 1,
		marginTop: 10
	},
	listContainer: {
		flex: 1,
	},
	list: {
		overflow: "scroll",
	},
	button: {
		marginTop: 10,
		borderWidth: 1,
		borderColor: "#d1d1d1",
		borderRadius: 5,
		backgroundColor: "#fff",
	}
});

export default Coupon;
