import React from 'react';
import AuthButton from "../AuthButton";
import AuthTextInput from '../AuthTextInput';
import { ThemeContext } from '../../ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';
import { TextInput } from 'react-native';

describe('Auth Components', () => {
    it("should render without crashing", () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <AuthTextInput /> 
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    })
    it("should render without crashing", () => {
        const rendered = render(
            <AuthButton /> 
        ).toJSON();

        expect(rendered).toBeTruthy();
    })
    it("should attempt login on Login", () => {
        const mockLoginHandler = jest.fn();

        const component = render(
            <AuthButton onPressHandler={mockLoginHandler} testID="button" />
        )
        
        fireEvent.press(component.getByTestId("button"))

        expect(mockLoginHandler).toHaveBeenCalled();
    })
    
})