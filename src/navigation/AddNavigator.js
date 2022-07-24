import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	AddItem,
} from "../screens";


const AddStack = createNativeStackNavigator();

const AddNavigator = () => (
    <AddStack.Navigator>
        <AddStack.Screen name="Add Item" component={AddItem} />
    </AddStack.Navigator>
);

export default AddNavigator;
