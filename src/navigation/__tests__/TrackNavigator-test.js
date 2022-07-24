import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from '../../components/Contexts/ThemeManager';
import { TrackNavigator } from '../';

jest.mock('firebase/auth', () => {
    return {
        getAuth: () => ({
            currentUser: {uid: "1", email: "test@test.com", is_email_verified: true},
        }),
    };
});

describe('Track Navigator', () => {
    it('should render without crashing', () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <NavigationContainer>
                    <TrackNavigator navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                </NavigationContainer>
            </ThemeContext.Provider>
        ).toJSON();
        
        expect(rendered).toBeTruthy();
    });

    it('should render Track screen first', () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <NavigationContainer>
                    <TrackNavigator navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                </NavigationContainer>
            </ThemeContext.Provider>
        );

        const itemList = page.getByTestId("item_list");
        
        expect(itemList).toBeTruthy();
    });
});