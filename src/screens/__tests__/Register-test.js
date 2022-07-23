import React from 'react';
import Register from "../Register";
import { ThemeContext } from '../../components/Contexts/ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';
import Toast from 'react-native-root-toast';
import * as auth from 'firebase/auth'

jest.mock('react', () => {
    const actualReact = jest.requireActual('react');
    return {
        ...actualReact,
        Keyboard: {
            dismiss: () => jest.fn()
        }
    };
})

jest.mock('firebase/auth');

Toast.show = jest.fn();
auth.createUserWithEmailAndPassword = jest.fn().mockReturnValue({
    then: () => ({
        catch: jest.fn()
    })
});

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

    it('Should display error toast when fields are empty', async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Register/>
            </ThemeContext.Provider>
        );

        const registerButton = page.getByTestId("register_button");
        fireEvent.press(registerButton);

        expect(Toast.show).toHaveBeenCalled();
        expect(auth.createUserWithEmailAndPassword).not.toHaveBeenCalled();
    })

    it('should change values in text inputs when input changes', () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Register/>
            </ThemeContext.Provider>
        );
        
        const emailField = page.getByTestId("email_field");
        const passwordField = page.getByTestId("password_field");
        const repeatPasswordField = page.getByTestId("repeat_password_field");
        fireEvent.changeText(emailField, "test@test123.com");
        fireEvent.changeText(passwordField, "test123");
        fireEvent.changeText(repeatPasswordField, "test12");

        expect(emailField.props.value).toEqual("test@test123.com");
        expect(passwordField.props.value).toEqual("test123");
        expect(repeatPasswordField.props.value).toEqual("test12");
    })

    it("should display error toast when both password fields don't match", () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Register/>
            </ThemeContext.Provider>
        );
        
        const emailField = page.getByTestId("email_field");
        const passwordField = page.getByTestId("password_field");
        const repeatPasswordField = page.getByTestId("repeat_password_field");
        const registerButton = page.getByTestId("register_button");
        fireEvent.changeText(emailField, "test@test123.com");
        fireEvent.changeText(passwordField, "test123");
        fireEvent.changeText(repeatPasswordField, "test12");

        fireEvent.press(registerButton);

        expect(Toast.show).toHaveBeenCalled();
    })

    it('should attempt to register with firebase if text inputs are not empty', () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Register/>
            </ThemeContext.Provider>
        );
        
        const emailField = page.getByTestId("email_field");
        const passwordField = page.getByTestId("password_field");
        const repeatPasswordField = page.getByTestId("repeat_password_field");
        const registerButton = page.getByTestId("register_button");
        fireEvent.changeText(emailField, "test@test123.com");
        fireEvent.changeText(passwordField, "test123");
        fireEvent.changeText(repeatPasswordField, "test123");

        fireEvent.press(registerButton);
        
        expect(auth.createUserWithEmailAndPassword).toHaveBeenCalled();
    })
})