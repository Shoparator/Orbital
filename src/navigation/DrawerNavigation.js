import React, { useContext } from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import {  signOut } from "firebase/auth";

import { auth } from "../firebase";
import { ThemeContext } from "../components/Contexts/ThemeManager";
import { AuthContext } from "../components/Contexts/AuthManager";
import { ToggleButton } from "../components";
import { TabNavigator } from "./";

const DrawerStack = createDrawerNavigator();

const DrawerNavigator = () => {
    const { setIsAuth } = useContext(AuthContext);
    const { darkTheme, toggleTheme } = useContext(ThemeContext);

    // Pop up to display message
	const showRes = (text) => {
		Toast.show(text, {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
	};

    const logoutHandler = () => {
        signOut(auth).then(() => {
            setIsAuth(false);
            showRes("Logged out successfullly!");
        });
    };
    
    const CustomDrawerContent = (props) => {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                    <ToggleButton
                        text={"Dark Mode"}
                        onPress={toggleTheme}
                        value={darkTheme}
                    />
                <DrawerItem label="Logout" onPress={() => logoutHandler()} />
            </DrawerContentScrollView>
        );
    }

    return (
        <DrawerStack.Navigator screenOptions={{ headerShown: false, swipeEdgeWidth: 100 }} drawerContent={props => <CustomDrawerContent {...props}/>}>
            <DrawerStack.Screen name="Main" component={TabNavigator} />
        </DrawerStack.Navigator>
    );
}

export default DrawerNavigator;