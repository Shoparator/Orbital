import React from 'react';
import SearchBar from '../SearchBar';
import { render, screen } from '@testing-library/react-native';

describe('Search Bar', () => {
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

    it("should display cancel button at start when focused", async () => {
        const page = render(<SearchBar clicked={true}/>);

        const searchBar = page.getByTestId("search_bar");
        const searchBarButton = page.queryByTestId("search_bar_button")

        expect(searchBar).toBeTruthy();
        expect(searchBarButton).toBeTruthy();
    })
})