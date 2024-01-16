import { Button, Text, View } from "react-native-ui-lib";
import { StepType } from ".";
import { Animated } from "react-native";
import { COLORS } from "../../utils/color";
import StatSVG from "../../assets/svgs/stat.svg";

const IntroStatus = ({ onPress, x, y }: StepType) => {
	return (
		<View flex center>
			<View flex-2 center>
				<Animated.View
					style={{
						transform: [{ translateX: x }, { translateY: y }],
					}}
				>
					<StatSVG width={250} height={400} />
				</Animated.View>
				<Text text40 color={COLORS.PRIMARY} center marginB-8>
					Monitor status
				</Text>
				<Text text70 color={COLORS.SECONDARY} center>
					Monitoring information:{" "}
					<Text color={COLORS.PRIMARY}>
						temperature, humidity, battery level, device power
					</Text>{" "}
					while using SAC device.
				</Text>
			</View>
			<View flex-1 width={"100%"} bottom>
				<Button
					onPress={onPress}
					backgroundColor={COLORS.PRIMARY}
					label="Fantastic"
				/>
			</View>
		</View>
	);
};
export default IntroStatus;
