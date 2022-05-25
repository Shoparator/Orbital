import React from "react";
import MainNavigation from "./src/navigation/MainNavigation";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
	return <MainNavigation />;
}
