import React from 'react';
import AddItem from "../AddItem";
import { ThemeContext } from '../../components/ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';
import * as Firestore from "firebase/firestore";
import Toast from 'react-native-root-toast';

Toast.show = jest.fn();

jest.mock('firebase/auth', () => {
    return {
        getAuth: () => ({
            currentUser: {uid: "1", email: "test@test.com", is_email_verified: true},
        }),
    };
});
jest.mock("firebase/firestore");

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


describe('Add Item screen', () => {
    it("should render the screen without crashing", async () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <AddItem/>
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    });

    it("should render child elements", async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <AddItem />
            </ThemeContext.Provider>
        );
        
        const nameField = page.getByTestId("name_field");
        const urlField = page.getByTestId("url_field");
        const thresholdField = page.getByTestId("threshold_field");
        const submitButton = page.getByTestId("submit_button");

        expect(nameField).toBeTruthy();
        expect(urlField).toBeTruthy();
        expect(thresholdField).toBeTruthy();
        expect(submitButton).toBeTruthy();
    });

    it('should render placeholder text', async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <AddItem />
            </ThemeContext.Provider>
        );
        
        const nameField = page.getByTestId("name_field");
        const urlField = page.getByTestId("url_field")
        const thresholdField = page.getByTestId("threshold_field");

        expect(nameField.props.placeholder).toEqual("Item Name.");
        expect(urlField.props.placeholder).toEqual("Item Url.")
        expect(thresholdField.props.placeholder).toEqual("Notify At.");
    })

    it('should display error toast if fields are empty', async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <AddItem />
            </ThemeContext.Provider>
        );
        
        const submitButton = page.getByTestId("submit_button");

        fireEvent.press(submitButton);

        expect(Toast.show).toHaveBeenCalledWith("Fields cannot be empty!", {
			duration: Toast.durations.SHORT,
			backgroundColor: "#fff",
			textColor: "black",
			position: Toast.positions.CENTER - 50,
		});
    })
})