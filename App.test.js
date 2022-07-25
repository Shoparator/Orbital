import React from 'react';
import 'react-native-gesture-handler/jestSetup';
import { render } from '@testing-library/react-native';
import App from './App';

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
  
    // The mock for `call` immediately calls the callback which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};
  
    return Reanimated;
});
  
// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('firebase/auth');

describe('App', () => {
    it('should render without crashing', () => {
        const rendered = render(<App />).toJSON();
        
        expect(rendered).toBeTruthy();
    });
});