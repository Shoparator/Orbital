import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from '../../components/Contexts/ThemeManager';
import { AddNavigator } from '../';

describe('Add Navigator', () => {
    it('should render without crashing', () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <NavigationContainer>
                    <AddNavigator />
                </NavigationContainer>
            </ThemeContext.Provider>
        ).toJSON();
        
        expect(rendered).toBeTruthy();
    });
});