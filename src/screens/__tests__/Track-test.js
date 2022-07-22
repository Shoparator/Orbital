import React from 'react';
import Track from "../Track";
import { ThemeContext } from '../../components/Contexts/ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';
import * as Firestore from "firebase/firestore";

jest.mock('firebase/auth', () => {
    return {
        getAuth: () => ({
            currentUser: {uid: "1", email: "test@test.com", is_email_verified: true},
        }),
    };
});

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
        }),
    };
});

jest.mock("firebase/firestore");

describe('Track screen', () => {
    it("should render the screen without crashing", async () => {
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Track/>
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    });

    it("should render child elements", async () => {
        const realUseState = React.useState;
        const stubInitialState = [
            {
                id: 1,
                imgUrl: "https://cf.shopee.sg/file/8a5d077c95cb1c60ea64a32248fa21d0_tn",
                name: "M1 Macbook 8 core 512gb 16gb",
                price: ["1078.00", "1078.00", "1078.00", "1078.00", "1078.00"],
                thresholdPrice: "800",
                time: ["07-13 09:10", "07-13 05:10", "07-13 01:10", "07-12 21:10", "07-132 17:10"],
                url: "https://shopee.sg/product/442800909/18314161043?smtt=0.179891669-1656087482.9"
            },
            {
                id: 2,
                imgUrl: "https://lzd-img-global.slatic.net/g/p/190a334ebe8f4f6b8d05e5654d61416b.jpg_720x720q80.jpg_.webp",
                name: "S22",
                price: ["1829.00", "1829.00", "1829.00", "1829.00", "1879.00"],
                thresholdPrice: "1000",
                time: ["07-13 09:10", "07-13 05:10", "07-13 01:10", "07-12 21:10", "07-132 17:10"],
                url: "https://www.lazada.sg/products/samsung-galaxy-5g-i2177483385-s12434648195.html?freeshipping=1&search=1&spm=a2o42.searchlist.list.i8.c1b98eb4LWkzgs"
            }
        ];

        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(stubInitialState));

        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Track />
            </ThemeContext.Provider>
        );

        const searchBar = page.getByTestId("search_bar");
        const list = page.getByTestId("item_list");
        
        const items = page.getAllByTestId("item_button")

        expect(searchBar).toBeTruthy();
        expect(list).toBeTruthy();
        expect(items.length).toEqual(2);
    });

    it("should attempt to data from Firestore", async () => {
        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Track/>
            </ThemeContext.Provider>
        )

        expect(Firestore.onSnapshot).toHaveBeenCalled();
    });

    it("should navigate to Item Details Page", async () => {
        const realUseState = React.useState;
        const stubInitialState = [
            {
                id: 1,
                imgUrl: "https://cf.shopee.sg/file/8a5d077c95cb1c60ea64a32248fa21d0_tn",
                name: "M1 Macbook 8 core 512gb 16gb",
                price: ["1078.00", "1078.00", "1078.00", "1078.00", "1078.00"],
                thresholdPrice: "800",
                time: ["07-13 09:10", "07-13 05:10", "07-13 01:10", "07-12 21:10", "07-132 17:10"],
                url: "https://shopee.sg/product/442800909/18314161043?smtt=0.179891669-1656087482.9"
            },
            {
                id: 2,
                imgUrl: "https://lzd-img-global.slatic.net/g/p/190a334ebe8f4f6b8d05e5654d61416b.jpg_720x720q80.jpg_.webp",
                name: "S22",
                price: ["1829.00", "1829.00", "1829.00", "1829.00", "1879.00"],
                thresholdPrice: "1000",
                time: ["07-13 09:10", "07-13 05:10", "07-13 01:10", "07-12 21:10", "07-132 17:10"],
                url: "https://www.lazada.sg/products/samsung-galaxy-5g-i2177483385-s12434648195.html?freeshipping=1&search=1&spm=a2o42.searchlist.list.i8.c1b98eb4LWkzgs"
            }
        ];

        jest.spyOn(React, 'useState').mockImplementationOnce(() => realUseState(stubInitialState));

        const page = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <Track />
            </ThemeContext.Provider>
        );
        
        const items = page.getAllByTestId("item_button");
        fireEvent.press(items[0]);

        expect(mockedNavigate).toHaveBeenCalledWith("Item Details", {data: {
            id: 1,
            imgUrl: "https://cf.shopee.sg/file/8a5d077c95cb1c60ea64a32248fa21d0_tn",
            name: "M1 Macbook 8 core 512gb 16gb",
            price: ["1078.00", "1078.00", "1078.00", "1078.00", "1078.00"],
            thresholdPrice: "800",
            time: ["07-13 09:10", "07-13 05:10", "07-13 01:10", "07-12 21:10", "07-132 17:10"],
            url: "https://shopee.sg/product/442800909/18314161043?smtt=0.179891669-1656087482.9"
        }});
    });
})