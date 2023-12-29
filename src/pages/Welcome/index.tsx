import React, {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Text, View } from "react-native-ui-lib";
import { Animated } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { RootDrawerParamList } from "../../../App";
import { COLORS } from "../../utils/color";
import WelcomePage from "./WelcomePage";
import IntroStatus from "./IntroStatus";
import IntroSetting from "./IntroSetting";
import GetNamePage from "./GetNamePage";

type welcomeScreenProp = DrawerNavigationProp<RootDrawerParamList, "Welcome">;

export type StepType = {
	onPress: VoidFunction;
	x: Animated.Value;
	y: Animated.Value;
};

const steps: { [key: number]: (props: StepType) => React.JSX.Element } = {
	0: WelcomePage,
	1: IntroStatus,
	2: IntroSetting,
	3: GetNamePage,
};
const stepsNum = 4;

const Welcome = () => {
	// Navigation
	const navigation = useNavigation<welcomeScreenProp>();

	const [active, setActive] = useState<number>(0);
	const slideAnim = useRef(new Animated.Value(0)).current;
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const position = useRef(new Animated.ValueXY({ x: -8, y: -8 })).current;

	const slideToLeft = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 200,
			useNativeDriver: true,
		}).start();

		Animated.spring(slideAnim, {
			toValue: -500,
			useNativeDriver: true,
		}).start();
	};

	const nextPage = () => {
		setTimeout(() => {
			if (active < 3) setActive((prev) => prev + 1);
		}, 100);
		slideToLeft();
	};

	const handleFinish = () => {
		navigation.navigate("Home");
	};

	useEffect(() => {
		slideAnim.resetAnimation();
		fadeAnim.resetAnimation();
	}, [active]);

	// Img float animated
	useLayoutEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(position, {
					toValue: { x: 0, y: 0 },
					duration: 0,
					useNativeDriver: true,
				}),
				Animated.timing(position, {
					toValue: { x: 12, y: 8 },
					duration: 3000,
					useNativeDriver: true,
				}),
				Animated.timing(position, {
					toValue: { x: -12, y: -8 },
					duration: 3000,
					useNativeDriver: true,
				}),
				Animated.timing(position, {
					toValue: { x: 12, y: 12 },
					duration: 3000,
					useNativeDriver: true,
				}),
				Animated.timing(position, {
					toValue: { x: 0, y: 0 },
					duration: 3000,
					useNativeDriver: true,
				}),
			])
		).start();
	}, [active]);

	const ActivePage = useMemo(() => {
		return steps[active] || WelcomePage;
	}, [active]);
	return (
		<View>
			<View
				center
				style={{ position: "absolute", top: 64, right: 32, zIndex: 1999 }}
			>
				<Text text70 color={COLORS.SECONDARY}>
					{active + 1}/4
				</Text>
			</View>
			<Animated.View
				style={[
					{
						display: "flex",
						width: "100%",
						height: "100%",
						paddingHorizontal: 16,
						paddingVertical: 32,
					},
					{ transform: [{ translateX: slideAnim }] },
				]}
			>
				{
					<ActivePage
						onPress={active + 1 === stepsNum ? handleFinish : nextPage}
						x={position.x}
						y={position.y}
					/>
				}
			</Animated.View>
		</View>
	);
};

export default Welcome;
