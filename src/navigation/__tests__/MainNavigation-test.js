import React from 'react';
import 'react-native-gesture-handler/jestSetup';
import { render } from '@testing-library/react-native';
import { ThemeContext } from '../../components/Contexts/ThemeManager';
import { AuthContext } from '../../components/Contexts/AuthManager';
import { MainNavigation } from '../';
import * as auth from 'firebase/auth';

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
        }),
        onAuthStateChanged: jest.fn()
    };
});

jest.mock('react', () => {
    const actualReact = jest.requireActual('react');
    return {
        ...actualReact,
        Keyboard: {
            dismiss: () => jest.fn()
        }
    };
})

describe('Main Navigator', () => {
    it('should render without crashing', () => {
        const rendered = render(
            <AuthContext.Provider value={{isAuth: true}} >
                <ThemeContext.Provider value={{darkTheme: false}}>
                        <MainNavigation navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                </ThemeContext.Provider>
            </AuthContext.Provider>
            
        ).toJSON();
        
        expect(rendered).toBeTruthy();
    });

    it('should render Track screen first if user is authenticated', () => {
        const page = render(
            <AuthContext.Provider value={{isAuth: true}} >
                <ThemeContext.Provider value={{darkTheme: false}}>
                        <MainNavigation navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                </ThemeContext.Provider>
            </AuthContext.Provider>
            
        );

        const itemList = page.getByTestId("item_list");
        
        expect(itemList).toBeTruthy();
    });

    it('should render Login screen first if user is not authenticated', () => {
        const page = render(
            <AuthContext.Provider value={{isAuth: false}} >
                <ThemeContext.Provider value={{darkTheme: false}}>
                        <MainNavigation navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                </ThemeContext.Provider>
            </AuthContext.Provider>
            
        );

        const header = page.getByTestId("login_header");
        
        expect(header).toBeTruthy();
    });

    it('should attempt to check if there is a user logged in and authenticated', () => {
        const page = render(
            <AuthContext.Provider value={{isAuth: false}} >
                <ThemeContext.Provider value={{darkTheme: false}}>
                        <MainNavigation navigation={{navigate: jest.fn(), setOptions: jest.fn()}} route = {{ params: { isAccesibilityModeOn: false } }}/>
                </ThemeContext.Provider>
            </AuthContext.Provider>
            
        );
        
        expect(auth.onAuthStateChanged).toHaveBeenCalled();
    });
});