import React from 'react';
import SearchBar from '../SearchBar';
import { fireEvent, render,screen } from '@testing-library/react-native';

describe('Auth Components', () => {
    it("should render without crashing", () => {
        const rendered = render(<SearchBar /> ).toJSON();

        expect(rendered).toBeTruthy();
    })
    
    it("should change the value after changing the input", () => {
        const {rerender} = render(<SearchBar searchPhrase="Testing" /> );
        const search_bar = screen.getByTestId("search_bar");

        expect(search_bar.props.value).toEqual("Testing");

        rerender(<SearchBar searchPhrase="Testing2" /> );

        expect(search_bar.props.value).toEqual("Testing2");
    })

    it("should not display cancel button when not focused", async () => {
        const page = render(<SearchBar clicked={false} />);

        const searchBar = page.getByTestId("search_bar");

        expect(searchBar).toBeTruthy();
        expect(page.queryByTestId('search_bar_button')).toBeNull();
    })

    it("should not display cancel button at start when focused", async () => {
        const page = render(<SearchBar clicked={true}/>);

        const searchBar = page.getByTestId("search_bar");
        const searchBarButton = page.queryByTestId("search_bar_button")

        expect(searchBar).toBeTruthy();
        expect(searchBarButton).toBeTruthy();
    })

    // it("should stop display of cancel button and stop focus when pressed", async () => {
    //     let clicked = [true];
    //     const page = render(<SearchBar clicked={clicked[0]} setClicked={(bool) => clicked[0] = bool} />);

    //     const searchBar = page.getByTestId("search_bar");
    //     const searchBarButton = page.queryByTestId("search_bar_button");

    //     fireEvent.press(searchBarButton);

    //     expect(searchBar.props.clicked).toEqual(false);
    //     expect(searchBarButton).toBeNull();
    // })
})