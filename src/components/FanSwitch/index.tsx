import { useState, useEffect } from "react";
import {
	withSpring,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { AnimatedImage, View, TouchableOpacity } from "react-native-ui-lib";

type FanSwitchProps = {
	state: boolean;
	onPress: () => void;
}

const FanSwitch = ({state, onPress: onChange}:FanSwitchProps) => {
	const angle = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: angle.value + "deg" }],
		};
	});

	// Turn on/off animation
	useEffect(() => {
		let interval: any;
		let interval2: any;
		if (state) {
			// Fan
			interval = setInterval(() => {
				if (angle.value % 360 === 0) angle.value = 0;
				angle.value = withSpring(angle.value + 60);
			}, 1000 / 30);
		}
		return () => {
			clearInterval(interval);
		};
	}, [state]);

	return (
		<TouchableOpacity onPress={onChange}>
			<View padding-4 row>
				<AnimatedImage
					source={require("../../assets/imgs/fan.png")}
					style={[
						{
							width: 50,
							height: 50,
						},
						animatedStyles,
					]}
					alt="Fan"
				/>
				<View />
			</View>
		</TouchableOpacity>
	);
};

export default FanSwitch;
