import React from 'react';
import ItemButton from "../ItemButton";
import VoucherBlock from '../VoucherBlock';
import { ThemeContext } from '../../ThemeManager';
import { render, fireEvent } from '@testing-library/react-native';

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

describe('Tracker Components', () => {
    it("should render without crashing", () => {
        const data = {
            "imgUrl": "https://cf.shopee.sg/file/8a5d077c95cb1c60ea64a32248fa21d0_tn",
            "name": "M1 Macbook 8 core 512gb 16gb",
            "price": ["1829.00", "1829.00", "1829.00", "1829.00", "1879.00"],
            "thresholdPrice": "1000",
            "time": ["07-13 09:10", "07-13 05:10", "07-13 01:10", "07-12 21:10", "07-12 17:10"],
            "url": "https://shopee.sg/product/442800909/18314161043?smtt=0.179891669-1656087482.9"
        };
        

        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <ItemButton data={data} /> 
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    })

    it("should render without crashing", () => {
        const data = "Media, Books, Stationery/$4/Min.spend $40/10-31 Jul,2022";
        const rendered = render(
            <ThemeContext.Provider value={{darkTheme: false}}>
                <VoucherBlock data={data} /> 
            </ThemeContext.Provider>
        ).toJSON();

        expect(rendered).toBeTruthy();
    })
    
})