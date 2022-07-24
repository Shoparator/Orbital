import React from 'react';
import ToggleButton from '../ToggleButton';
import { ThemeContext } from '../../Contexts/ThemeManager';
import { fireEvent, render } from '@testing-library/react-native';

describe('Toggle Button', () => {
    it("should render without crashing", () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <ToggleButton />
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    })

    it("should render the text that is passed", () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <ToggleButton text="test text" />
            </ThemeContext.Provider>
        );

        const text = page.getByText("test text");
        
        expect(text).toBeTruthy();
    })
    
    it("should call function passed as onPress when button is pressed", () => {
        const testFn = jest.fn();
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <ToggleButton onPress={testFn}/>
            </ThemeContext.Provider>
        );

        const button = page.getByTestId("toggle_button");

        fireEvent(button, 'valueChange', true);

        expect(testFn).toHaveBeenCalled();
    })
})