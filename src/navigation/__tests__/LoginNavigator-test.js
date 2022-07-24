import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from '../../components/Contexts/ThemeManager';
import { LoginNavigator } from '../';

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

describe('Login Navigator', () => {
    it('should render without crashing', () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <NavigationContainer>
                    <LoginNavigator navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                </NavigationContainer>
            </ThemeContext.Provider>
        ).toJSON();
        
        expect(rendered).toBeTruthy();
    });

    it('should render Login screen first', () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <NavigationContainer>
                    <LoginNavigator navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                </NavigationContainer>
            </ThemeContext.Provider>
        );
        
        const header = page.getByTestId("login_header");
        
        expect(header).toBeTruthy();
    });
});