import { Button, Text, View } from "react-native-ui-lib";
import { StepType } from ".";
import { Animated } from "react-native";
import { COLORS } from "../../utils/color";
import SettingSVG from "../../assets/svgs/setting.svg";

const IntroSetting = ({ onPress, x, y }: StepType) => {
	return (
		<View flex center>
			<View flex-2 center>
				<Animated.View
					style={{
						transform: [{ translateX: x }, { translateY: y }],
					}}
				>
					<SettingSVG width={250} height={400} />
				</Animated.View>
				<Text text40 color={COLORS.PRIMARY} center marginB-8>
					Thiết lập tự động
				</Text>
				<Text text70 color={COLORS.SECONDARY} center>
					Thiết lập tự động bật/tắt thiết bị dựa trên:{" "}
					<Text color={COLORS.PRIMARY}>nhiệt độ, độ ẩm</Text> khi sử dụng thiết
					bị của SAC
				</Text>
			</View>
			<View flex-1 width={"100%"} bottom>
				<Button
					onPress={onPress}
					backgroundColor={COLORS.PRIMARY}
					label="Quá tiện lợi"
				/>
			</View>
		</View>
	);
};

export default IntroSetting;
