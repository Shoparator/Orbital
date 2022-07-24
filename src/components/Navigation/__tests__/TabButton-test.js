import React from 'react';
import TabButton from '../TabButton';
import { fireEvent, render } from '@testing-library/react-native';

describe('TabButton ', () => {
    it("should render without crashing", () => {
        const rendered = render(<TabButton item={{iconName: "test name", route: "test route"}} accessibilityState={{selected: true}} />).toJSON();

        expect(rendered).toBeTruthy();
    })

    it("should render the icon and the route name that is passed", () => {
        const testItem = {iconName: "test name", route: "test route"};
        const page = render(<TabButton item={testItem} accessibilityState={{selected: true}} />);

        const icon = page.getByTestId("icon");
        const text = page.getByText("test route");
        
        expect(icon).toBeTruthy();
        expect(text).toBeTruthy();
    })
    
    it("should call function passed as onPress when button is pressed", () => {
        const testFn = jest.fn();
        const testItem = {iconName: "test name", route: "test route"};
        const page = render(<TabButton item={testItem} onPress={testFn} accessibilityState={{selected: true}}/>);

        const button = page.getByTestId("tab_button");

        fireEvent(button, 'onPress', true);

        expect(testFn).toHaveBeenCalled();
    })

})