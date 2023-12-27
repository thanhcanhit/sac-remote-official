import React, { useEffect } from "react";
import Animated, {
	withSpring,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";
import { BOX_SHADOW } from "../../utils/styles";
import FanSVG from "../../assets/svgs/fan.svg";

type FanSwitchProps = {
	state: boolean;
	onPress: React.Dispatch<React.SetStateAction<boolean>>;
};

const FanSwitch = ({ state, onPress: onChange }: FanSwitchProps) => {
	const angle = useSharedValue(0);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: angle.value + "deg" }],
		};
	});

	// Turn on/off animation
	useEffect(() => {
		let interval: any;
		if (state) {
			// Fan
			interval = setInterval(() => {
				if (angle.value % 360 === 0) angle.value = 0;
				angle.value = withSpring(angle.value + 60);
			}, 1000 / 20);
		}
		return () => {
			clearInterval(interval);
		};
	}, [state]);

	return (
		<TouchableOpacity
			onPress={() => onChange(!state)}
			br100
			backgroundColor={COLORS.WHITE}
			style={BOX_SHADOW.SMALL}
		>
			<Animated.View
				style={[
					{
						padding: 4,
					},
					animatedStyles,
				]}
			>
				<FanSVG width={40} height={40} color={COLORS.PRIMARY} />
			</Animated.View>
		</TouchableOpacity>
	);
};

export default React.memo(FanSwitch);
