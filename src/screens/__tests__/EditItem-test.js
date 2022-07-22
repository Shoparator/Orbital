import React from 'react';
import EditItem from "../EditItem";
import { ThemeContext } from '../../components/Contexts/ThemeManager';
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

describe('Edit Item screen', () => {
    it("should render the screen without crashing", async () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <EditItem/>
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    });

    it("should render child elements", async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <EditItem />
            </ThemeContext.Provider>
        );
        
        const name = page.getByTestId("name");
        const thresholdPrice = page.getByTestId("threshold_price");
        const submitButton = page.getByTestId("submit_button")

        expect(name).toBeTruthy();
        expect(thresholdPrice).toBeTruthy();
        expect(submitButton).toBeTruthy();
    });

    it('should render placeholder text', async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <EditItem />
            </ThemeContext.Provider>
        );
        
        const name = page.getByTestId("name");
        const thresholdPrice = page.getByTestId("threshold_price");

        expect(name.props.placeholder).toEqual("M1 Macbook 8 core 512gb 16gb");
        expect(thresholdPrice.props.placeholder).toEqual("800");
    })

})