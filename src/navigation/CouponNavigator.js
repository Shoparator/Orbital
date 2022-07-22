import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	Coupon
} from "../screens";

const CouponStack = createNativeStackNavigator();

const CouponNavigator = () => (
    <CouponStack.Navigator>
        <CouponStack.Screen name="Coupons" component={Coupon} />
    </CouponStack.Navigator>
);

export default CouponNavigator;