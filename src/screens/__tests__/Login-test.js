import React from 'react';
import Login from "../Login";
import { ThemeContext } from '../../components/ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';
import renderer from 'react-test-renderer';


describe('Login screen', () => {
    it("should render the screen without crashing", () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Login/>
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    })

    it("should render all elements", () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Login/>
            </ThemeContext.Provider>
        );

        const logo = page.getByTestId("logo");
        const header = page.getByTestId("header");
        const emailField = page.getByTestId("email_field");
        const passwordField = page.getByTestId("password_field");
        const navigateToForget = page.getByTestId("navigate_to_forget");
        const loginButton = page.getByTestId("login_button");
        const navigateToRegister = page.getByTestId("navigate_to_register");

        expect(logo).toBeTruthy();
        expect(header).toBeTruthy();
        expect(emailField).toBeTruthy();
        expect(passwordField).toBeTruthy();
        expect(navigateToForget).toBeTruthy();
        expect(loginButton).toBeTruthy();
        expect(navigateToRegister).toBeTruthy();
    })

    it('Should go to register on register', async () => {
        const navigation = {navigate: () => {}};
        spyOn(navigation, 'navigate');

        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Login navigation={navigation} />
            </ThemeContext.Provider>
        );

        const redirectRegister = page.getByTestId("navigate_to_register");

        fireEvent.press(redirectRegister);

        expect(navigation.navigate).toHaveBeenCalledWith("Register");
    })

    it('Should go to forget on forget', async () => {
        const navigation = {navigate: () => {}};
        spyOn(navigation, 'navigate');

        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Login navigation={navigation} />
            </ThemeContext.Provider>
        );

        const redirectForget = page.getByTestId("navigate_to_forget");

        fireEvent.press(redirectForget);

        expect(navigation.navigate).toHaveBeenCalledWith("Forget");
    })

    // it('Should attempt login at Login', async () => {
    //     let login = renderer.create(
    //         <ThemeContext.Provider value={{darkTheme: false}}>
    //             <Login/>
    //         </ThemeContext.Provider>
    //     ).getInstance();

    //     const page = render(
    //         <ThemeContext.Provider value={{darkTheme: false}}>
    //             <Login/>
    //         </ThemeContext.Provider>
    //     );

    //     const loginButton = page.getByTestId("login_button");

    //     fireEvent.press(loginButton);

    //     expect(login.loginHandler()).toBeCalled();
    // })
})