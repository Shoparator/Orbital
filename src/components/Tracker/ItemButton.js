import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ItemImage } from "..";

const ItemButton = (props) => {
	const { data } = props;
	const navigation = useNavigation();

	return (
		<TouchableOpacity
			onPress={() =>
				navigation.navigate("Item Details", {
					data: data,
				})
			}
		>
			<ItemImage data={data} />
		</TouchableOpacity>
	);
};

export default ItemButton;
