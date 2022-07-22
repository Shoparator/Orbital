import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import { TabButton } from "../components";
import { TrackNavigator, AddNavigator, CouponNavigator } from "./";

const Tab = createBottomTabNavigator();
const trackName = "Track";
const couponsName = "Coupons";

const BottomTabButton = ({ children, onPress }) => {
    return (
        <TouchableOpacity style={styles.BottomTabButton} onPress={onPress}>
            <View style={styles.BottomTabButtonView}>{children}</View>
        </TouchableOpacity>
    );
};

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarButton: (props) => {
                let item;
                let currentTab = route.name;

                if (currentTab === trackName) {
                    item = {
                        route: trackName,
                        iconName: "show-chart",
                    };
                } else if (currentTab === couponsName) {
                    item = {
                        route: couponsName,
                        iconName: "local-atm",
                    };
                }
                return <TabButton {...props} item={item} />;
            },
            tabBarStyle: styles.tabBar,
            headerShown: false,
            tabBarShowLabel: false,
        })}
    >
        <Tab.Screen name={trackName} component={TrackNavigator} />
        <Tab.Screen
            name={"Add"}
            component={AddNavigator}
            options={{
                tabBarIcon: ({ focused }) => {
                    return (
                        <View style={{ left: 1 }}>
                            <Ionicons name="add" size={40} color="#fff" />
                        </View>
                    );
                },
                tabBarButton: (props) => {
                    return <BottomTabButton {...props} />;
                },
                ...styles.tabScreen,
            }}
        />
        <Tab.Screen name={couponsName} component={CouponNavigator} />
    </Tab.Navigator>
);

export default TabNavigator;

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
	BottomTabButton: {
		top: -20,
		justifyContent: "center",
		alignItems: "center",
	},
	BottomTabButtonView: {
		width: 60,
		height: 60,
		borderRadius: 35,
		borderColor: "#fff",
		borderWidth: 2,
		backgroundColor: "rgba(10,132,255,1)",
		shadowColor: "#7F5df0",
		shadowOpacity: 10,
		shadowRadius: 35,
		elevation: 10,
	},
});