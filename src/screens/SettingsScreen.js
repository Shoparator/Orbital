import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SettingsScreen = ({ navigation }) => (
    <View style={styles.home} onPress={() => navigation.navigate("Home")}>
        <Text>SettingsScreen</Text>
    </View>
);

const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default SettingsScreen;