import React from 'react';
import Coupon from "../Coupon";
import { ThemeContext } from '../../components/ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';
import * as Firestore from "firebase/firestore";

jest.mock('firebase/auth', () => {
    return {
        getAuth: () => ({
            currentUser: {uid: "1", email: "test@test.com", is_email_verified: true},
        }),
    };
});

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
        }),
    };
});

jest.mock("firebase/firestore");

describe('Coupon screen', () => {
    it("should render the screen without crashing", async () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Coupon/>
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    });

    it("should render child elements", async () => {
        const realUseState = React.useState;
        const lazadaVouchers = [
            "Media, Books, Stationery/$4/Min.spend $40/10-31 Jul,2022",
            "KD Fair/$4/Min.spend $40/18-31 Jul,2022",
            "Motors/$7/Min.spend $80/10-31 Jul,2022"
        ];
        const shopeeVouchers = [
            "NEW USER VOUCHER/$10 OFF/Min. Spend $0 No Cap/First Purchase Only/Valid Till 31 Dec",
            "SHOPEE SUPERMARKET/25% Cashback/Capped at $8/Mall Exclusive to 1st Purchase/Valid Till 31 Dec"
        ]
        const time = "07-19 22:44";

        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(lazadaVouchers));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(shopeeVouchers));
        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(time));

        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Coupon />
            </ThemeContext.Provider>
        );

        const lazadaButton = page.getByTestId("lazada_button");
        const shopeeButton = page.getByTestId("shopee_button");
        const timeElement = page.getByTestId("time");
        const list = page.getByTestId("voucher_list");
        const vouchers = page.getAllByTestId("voucher_block");
        
        expect(lazadaButton).toBeTruthy();
        expect(shopeeButton).toBeTruthy();
        expect(timeElement).toBeTruthy();
        expect(list).toBeTruthy();
        expect(vouchers.length).toEqual(3);
    });

    it("should attempt to data from Firestore", async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Coupon/>
            </ThemeContext.Provider>
        )

        expect(Firestore.onSnapshot).toHaveBeenCalled();
    });
    
})