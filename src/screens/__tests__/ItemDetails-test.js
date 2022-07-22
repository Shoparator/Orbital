import React from 'react';
import ItemDetails from "../ItemDetails";
import { ThemeContext } from '../../components/ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';
import * as Firestore from "firebase/firestore";
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons';

jest.mock('firebase/auth', () => {
    return {
        getAuth: () => ({
            currentUser: {uid: "1", email: "test@test.com", is_email_verified: true},
        }),
    };
});

const mockedNavigate = jest.fn();
const mockedSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
            setOptions: mockedSetOptions
        }),
        useRoute: () => ({
            params: {
                data: {
                    id: 1,
                    imgUrl: "https://cf.shopee.sg/file/8a5d077c95cb1c60ea64a32248fa21d0_tn",
                    name: "M1 Macbook 8 core 512gb 16gb",
                    price: ["1078.00", "1078.00", "1078.00", "1078.00", "1078.00"],
                    thresholdPrice: "800",
                    time: ["07-13 09:10", "07-13 05:10", "07-13 01:10", "07-12 21:10", "07-132 17:10"],
                    url: "https://shopee.sg/product/442800909/18314161043?smtt=0.179891669-1656087482.9"
                }
            }
          }),
    };
});

jest.mock("firebase/firestore");

describe('Item Details screen', () => {
    it("should render the screen without crashing", async () => {

        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <ItemDetails/>
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    });

    it("should render child elements", async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <ItemDetails />
            </ThemeContext.Provider>
        );
        
        const image = page.getByTestId("image");
        const name = page.getByTestId("name");
        const price = page.getByTestId("price");
        const thresholdPrice = page.getByTestId("threshold_price");

        expect(mockedSetOptions).toHaveBeenCalled(); // attempt to create delete button
        expect(image).toBeTruthy();
        expect(name).toBeTruthy();
        expect(price).toBeTruthy();
        expect(thresholdPrice).toBeTruthy();
    });

    it("should navigate to Edit Item Page", async () => {

        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <ItemDetails />
            </ThemeContext.Provider>
        );
        
        const button = page.getByTestId("navigate_to_edit_item");
        fireEvent.press(button);

        expect(mockedNavigate).toHaveBeenCalledWith("Edit Item", {data: {
            id: 1,
            imgUrl: "https://cf.shopee.sg/file/8a5d077c95cb1c60ea64a32248fa21d0_tn",
            name: "M1 Macbook 8 core 512gb 16gb",
            price: ["1078.00", "1078.00", "1078.00", "1078.00", "1078.00"],
            thresholdPrice: "800",
            time: ["07-13 09:10", "07-13 05:10", "07-13 01:10", "07-12 21:10", "07-132 17:10"],
            url: "https://shopee.sg/product/442800909/18314161043?smtt=0.179891669-1656087482.9"
        }});
    });
})