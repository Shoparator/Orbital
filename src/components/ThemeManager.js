import React, { createContext, useState } from "react";
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => { // Theme data accessible to any screen in the app
	const [darkTheme, setDarkTheme] = useState(Appearance.getColorScheme() == "dark" ? true : false); // sets default to be same as system

	const toggleTheme = () => {
		setDarkTheme(!darkTheme);
	};

	return (
		<ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
