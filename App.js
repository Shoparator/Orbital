import React from "react";
import Navigator from "./src/navigation";
import { LogBox } from "react-native";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default function App() {
	return <Navigator />;
}
