import React from 'react';
import Register from "../Register";
import { ThemeContext } from '../../components/ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';


describe('Register screen', () => {
    it("should render the screen without crashing", () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Register/>
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    })

    it("should render all elements", () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Register/>
            </ThemeContext.Provider>
        );

        const logo = page.getByTestId("logo");
        const header = page.getByTestId("header");
        const emailField = page.getByTestId("email_field");
        const passwordField = page.getByTestId("password_field");
        const repeatPasswordField = page.getByTestId("repeat_password_field");
        const loginButton = page.getByTestId("register_button");
        const navigateToLogin = page.getByTestId("navigate_to_login");

        expect(logo).toBeTruthy();
        expect(header).toBeTruthy();
        expect(emailField).toBeTruthy();
        expect(passwordField).toBeTruthy();
        expect(repeatPasswordField).toBeTruthy();
        expect(loginButton).toBeTruthy();
        expect(navigateToLogin).toBeTruthy();
    })

    it('Should go to register on register', async () => {
        const navigation = {navigate: () => {}};
        spyOn(navigation, 'navigate');

        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Register navigation={navigation} />
            </ThemeContext.Provider>
        );

        const redirectRegister = page.getByTestId("navigate_to_login");

        fireEvent.press(redirectRegister);

        expect(navigation.navigate).toHaveBeenCalledWith("Login");
    })
})