import React from 'react';
import 'react-native-gesture-handler/jestSetup';
import { fireEvent, render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from '../../components/Contexts/ThemeManager';
import { AuthContext } from '../../components/Contexts/AuthManager';
import { DrawerNavigator } from '../';
import * as auth from 'firebase/auth'

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
  
    // The mock for `call` immediately calls the callback which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};
  
    return Reanimated;
});
  
// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('firebase/auth', () => {
    const actualAuth = jest.requireActual('firebase/auth');
    return {
        ...actualAuth,
        getAuth: () => ({
            currentUser: {uid: "1", email: "test@test.com", is_email_verified: true},
        }),
        signOut: jest.fn().mockReturnValue({
            then: () => ({
                catch: jest.fn()
            })
        })
    };
});

describe('Drawer Navigator', () => {
    it('should render without crashing', () => {
        const rendered = render(
            <AuthContext.Provider value={{isAuth: true}} >
                <ThemeContext.Provider value={{darkTheme: false}}>
                    <NavigationContainer>
                        <DrawerNavigator navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                    </NavigationContainer>
                </ThemeContext.Provider>
            </AuthContext.Provider>
            
        ).toJSON();
        
        expect(rendered).toBeTruthy();
    });

    it('should display custom element in drawer', () => {
        const page = render(
            <AuthContext.Provider value={{isAuth: true}} >
                <ThemeContext.Provider value={{darkTheme: false}}>
                    <NavigationContainer>
                        <DrawerNavigator navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                    </NavigationContainer>
                </ThemeContext.Provider>
            </AuthContext.Provider>
            
        );

        const toggleButton = page.getByTestId("toggle_button");
        const logoutButton = page.getByText("Logout");
        
        expect(toggleButton).toBeTruthy();
        expect(logoutButton).toBeTruthy();
    });

    it('should attempt to sign out with firebase when logoput button is pressed', () => {
        const page = render(
            <AuthContext.Provider value={{isAuth: true}} >
                <ThemeContext.Provider value={{darkTheme: false}}>
                    <NavigationContainer>
                        <DrawerNavigator navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                    </NavigationContainer>
                </ThemeContext.Provider>
            </AuthContext.Provider>
            
        );

        const logoutButton = page.getByText("Logout");
        
        fireEvent.press(logoutButton);

        expect(auth.signOut).toHaveBeenCalled();
    });
});