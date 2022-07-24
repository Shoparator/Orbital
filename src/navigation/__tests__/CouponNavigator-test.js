import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from '../../components/Contexts/ThemeManager';
import { CouponNavigator } from '../';

describe('Coupon Navigator', () => {
    it('should render without crashing', () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <NavigationContainer>
                    <CouponNavigator />
                </NavigationContainer>
            </ThemeContext.Provider>
        ).toJSON();
        
        expect(rendered).toBeTruthy();
    });
});