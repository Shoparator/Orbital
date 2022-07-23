import React from 'react';
import AuthTextInput from '../AuthTextInput';
import { ThemeContext } from '../../Contexts/ThemeManager';
import { fireEvent, render,screen } from '@testing-library/react-native';

describe('Auth Components', () => {
    it("should render without crashing", () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <AuthTextInput /> 
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    })

    it("should render a placeholder", () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <AuthTextInput placeholder="Testing" testID="test" /> 
            </ThemeContext.Provider>
        );

        const textInput = page.getByTestId("test");

        expect(textInput.props.placeholder).toEqual("Testing");
    })
    
    it("should change the value after changing the input", () => {
        const {rerender} = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <AuthTextInput value="Testing" testID="test" /> 
            </ThemeContext.Provider>
        );
        const textInput = screen.getByTestId("test");

        expect(textInput.props.value).toEqual("Testing");

        rerender(<ThemeContext.Provider value={{darkTheme: false}}>
            <AuthTextInput value="Testing2" testID="test" /> 
        </ThemeContext.Provider>)

        expect(textInput.props.value).toEqual("Testing2");
    })
})