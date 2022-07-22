import React, {  useEffect } from "react";
import { StyleSheet } from "react-native";

import {
	getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
	Track,
	ItemDetails,
	EditItem,
} from "../screens";

const TrackStack = createNativeStackNavigator();

const TrackNavigator = ({ navigation, route }) => {
    const tabHiddenRoutes = ["Item Details", "Edit Item"];
    useEffect(() => {
        if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
            navigation.setOptions({ tabBarStyle: { display: "none" } });
        } else {
            navigation.setOptions({
                tabBarStyle: { ...styles.tabBar },
            });
        }
    }, [navigation, route]);

    return (
        <TrackStack.Navigator
            initialRouteName="Currently Tracking"
            screenOptions={{
                headerLargeTitle: "Currently Tracking",
            }}
        >
            <TrackStack.Screen
                name="Currently Tracking"
                component={Track}
            />
            <TrackStack.Screen
                name="Item Details"
                component={ItemDetails}
            />
            <TrackStack.Screen name="Edit Item" component={EditItem} />
        </TrackStack.Navigator>
    );
};

export default TrackNavigator;

const styles = StyleSheet.create({
	tabBar: {
		height: 50,
		position: "absolute",
		bottom: 20,
		right: 20,
		left: 20,
		borderRadius: 15,
		shadowColor: "#7F5df0",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.5,
		elevation: 5,
	},
});