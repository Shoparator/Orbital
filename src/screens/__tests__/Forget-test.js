import React from 'react';
import Forget from "../Forget";
import { ThemeContext } from '../../components/ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';
import Toast from 'react-native-root-toast';
import * as auth from 'firebase/auth'

Toast.show = jest.fn();
jest.mock("firebase/auth");

describe('Forget screen', () => {
    it("should render the screen without crashing", () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Forget/>
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    })

    it("should render all elements", () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Forget/>
            </ThemeContext.Provider>
        );

        const logo = page.getByTestId("logo");
        const header = page.getByTestId("header");
        const emailField = page.getByTestId("email_field");
        const submitButton = page.getByTestId("submit_button");
        const navigateToLogin = page.getByTestId("navigate_to_login");

        expect(logo).toBeTruthy();
        expect(header).toBeTruthy();
        expect(emailField).toBeTruthy();
        expect(submitButton).toBeTruthy();
        expect(navigateToLogin).toBeTruthy();
    })

    it('Should go to register on register', async () => {
        const navigation = {navigate: () => {}};
        spyOn(navigation, 'navigate');

        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Forget navigation={navigation} />
            </ThemeContext.Provider>
        );

        const redirectRegister = page.getByTestId("navigate_to_login");

        fireEvent.press(redirectRegister);

        expect(navigation.navigate).toHaveBeenCalledWith("Login");
    })

    it('Should display error toast when fields are empty', async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Forget/>
            </ThemeContext.Provider>
        );

        const submitButton = page.getByTestId("submit_button");
        fireEvent.press(submitButton);

        expect(Toast.show).toHaveBeenCalled();
        expect(auth.sendPasswordResetEmail).not.toHaveBeenCalled();
    })
})