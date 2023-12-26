import { Button, Text, View } from "react-native-ui-lib";
import { StepType } from ".";
import { Animated } from "react-native";
import { COLORS } from "../../utils/color";
import WelcomeSVG from "../../assets/svgs/welcome.svg";

const WelcomePage = ({ onPress, x, y }: StepType) => {
	return (
		<View flex center>
			<View flex-2 center>
				<Animated.View
					style={{
						transform: [{ translateX: x }, { translateY: y }],
					}}
				>
					<WelcomeSVG width={250} height={400} />
				</Animated.View>
				<Text text40 color={COLORS.PRIMARY} center marginB-8>
					Chào mừng
				</Text>
				<Text text70 color={COLORS.SECONDARY} center>
					Chào mừng bạn đã đến với SAC Remote ❤️ {"\n"}
					Ứng dụng này sẽ hỗ trợ bạn khi sử dụng thiết bị của SAC (Smart AirCon
					Clothing)
				</Text>
			</View>
			<View flex-1 width={"100%"} bottom>
				<Button
					backgroundColor={COLORS.PRIMARY}
					onPress={onPress}
					label="Bắt đầu khám phá ngay"
				/>
			</View>
		</View>
	);
};

export default WelcomePage;