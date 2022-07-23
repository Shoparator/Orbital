import React, { useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { MaterialIcons } from "@expo/vector-icons";

const TabButton = (props) => {
	const { item, onPress, accessibilityState } = props;
	const focused = accessibilityState.selected;
	const viewRef = useRef(null);
	const circleRef = useRef(null);
	const textRef = useRef(null);

	useEffect(() => {
		if (focused) {
			viewRef.current.animate(styles.animateFocused);
			circleRef.current.animate(styles.circleFocused);
			textRef.current.transitionTo({ scale: 1 });
		} else {
			viewRef.current.animate(styles.animateUnfocused);
			circleRef.current.animate(styles.circleUnfocused);
			textRef.current.transitionTo({ scale: 0 });
		}
	}, [focused]);

	return (
		<TouchableOpacity
			onPress={onPress}
			activeOpacity={1}
			style={styles.container}
			testID = "tab_button"
		>
			<Animatable.View
				ref={viewRef}
				duration={300}
				style={styles.container}
			>
				<View style={styles.btn}>
					<Animatable.View
						ref={circleRef}
						style={styles.circle}
						duration={300}
					/>
					<MaterialIcons
						name={item.iconName}
						color={focused ? "#fff" : "#CCCCC4"}
						size={25}
					/>
				</View>
				<Animatable.Text ref={textRef} style={styles.text}>
					{item.route}
				</Animatable.Text>
			</Animatable.View>
		</TouchableOpacity>
	);
};

export default TabButton;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	tabBar: {
		height: 70,
		position: "absolute",
		bottom: 16,
		right: 16,
		left: 16,
		borderRadius: 16,
	},
	btn: {
		width: 40,
		height: 40,
		borderRadius: 25,
		borderWidth: 4,
		borderColor: "#fff",
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
	},
	circle: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(10,132,255,1)",
		borderRadius: 25,
	},
	text: {
		fontSize: 12,
		textAlign: "center",
		color: "rgba(10,132,255,1)",
	},
	animateFocused: {
		0: { scale: 0.5, translateY: 5 },
		0.92: { translateY: -30 },
		1: { scale: 1, translateY: -20 },
	},
	animateUnfocused: {
		0: { scale: 1.2, translateY: -24 },
		1: { scale: 1, translateY: 7 },
	},
	circleFocused: {
		0: { scale: 0 },
		0.3: { scale: 0.9 },
		0.5: { scale: 0.2 },
		0.8: { scale: 0.7 },
		1: { scale: 1 },
	},
	circleUnfocused: {
		0: { scale: 1 },
		1: { scale: 0 },
	},
});
