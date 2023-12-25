import React, { Fragment, useMemo, useState } from "react";
import { Button, Text, TextField, View } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";
import WelcomeSVG from "../../assets/svgs/welcome.svg";
import StatSVG from "../../assets/svgs/stat.svg";
import SettingSVG from "../../assets/svgs/setting.svg";
import ChatSVG from "../../assets/svgs/chat.svg";
import { KeyboardAvoidingView } from "react-native";
import localStorage, { USER_INFO_KEY } from "../../storage/storage";

const Welcome = ({ onFinish }: { onFinish: VoidFunction }) => {
	const [active, setActive] = useState<number>(0);
	const [touchX, setTouchX] = useState<number>(0);

	const nextPage = () => {
		if (active < 3) setActive((prev) => prev + 1);
		setTouchX(0);
	};

	const getActivePage = useMemo(() => {
		switch (active) {
			case 0:
				return <WelcomePage onPress={nextPage} />;
			case 1:
				return <IntroStatus onPress={nextPage} />;
			case 2:
				return <IntroSetting onPress={nextPage} />;
			case 3:
				return <GetNamePage onPress={onFinish} />;
			default:
				return <Fragment />;
		}
	}, [active]);

	return (
		<Fragment>
			<View center style={{ position: "absolute", top: 64, right: 32 }}>
				<Text text70 color={COLORS.SECONDARY}>
					{active + 1}/4
				</Text>
			</View>
			<View
				flex
				paddingH-16
				paddingV-32
				onTouchStart={(e) => setTouchX(e.nativeEvent.pageX)}
				onTouchEnd={(e) => {
					if (touchX - e.nativeEvent.pageX > 50) nextPage();
				}}
			>
				{getActivePage}
			</View>
		</Fragment>
	);
};

const WelcomePage = ({ onPress }: { onPress: VoidFunction }) => {
	return (
		<View flex center>
			<View flex-2 center>
				<WelcomeSVG width={250} height={400} />
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
					fullWidth
					br40
					backgroundColor={COLORS.PRIMARY}
					onPress={onPress}
					label="Bắt đầu khám phá ngay"
				/>
			</View>
		</View>
	);
};
const IntroStatus = ({ onPress }: { onPress: VoidFunction }) => {
	return (
		<View flex center>
			<View flex-2 center>
				<StatSVG width={250} height={400} />
				<Text text40 color={COLORS.PRIMARY} center marginB-8>
					Theo dõi trạng thái
				</Text>
				<Text text70 color={COLORS.SECONDARY} center>
					Theo dõi các thông tin:{" "}
					<Text color={COLORS.PRIMARY}>
						nhiệt độ, độ ẩm, lượng pin, nguồn thiết bị
					</Text>{" "}
					khi sử dụng thiết bị của SAC
				</Text>
			</View>
			<View flex-1 width={"100%"} bottom>
				<Button
					fullWidth
					br40
					onPress={onPress}
					backgroundColor={COLORS.PRIMARY}
					label="Tuyệt vời"
				/>
			</View>
		</View>
	);
};
const IntroSetting = ({ onPress }: { onPress: VoidFunction }) => {
	return (
		<View flex center>
			<View flex-2 center>
				<SettingSVG width={250} height={400} />
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
					fullWidth
					br40
					onPress={onPress}
					backgroundColor={COLORS.PRIMARY}
					label="Quá tiện lợi"
				/>
			</View>
		</View>
	);
};

const GetNamePage = ({ onPress }: { onPress: VoidFunction }) => {
	const [name, setName] = useState<string>("");

	const handleSaveName = () => {
		localStorage.save({ key: USER_INFO_KEY, data: name });
		try {
      onPress();
    } catch (e) {}
	};

	return (
		<View flex center>
			<KeyboardAvoidingView style={{ width: "100%", height: "100%" }}>
				<View flex-2 center>
					<ChatSVG width={250} height={400} />
					<Text text50 color={COLORS.PRIMARY} center marginB-16>
						Hãy cho tôi biết tên bạn là gì?
					</Text>
					<View left paddingH-8>
						<TextField
							value={name}
							onChange={(e) => setName(e.nativeEvent.text)}
							text60
							color={COLORS.TEXT_BLACK}
							showCharCounter
							validate={["required"]}
							validationMessage={["Hãy cho chúng tôi biết tên của bạn nhé 👋"]}
							maxLength={30}
							fieldStyle={{
								borderWidth: 1,
								width: "100%",
								padding: 8,
								borderColor: COLORS.LIGHT_GRAY,
								borderRadius: 8,
							}}
						/>
					</View>
				</View>
				<View flex-1 width={"100%"} bottom>
					<Button
						fullWidth
						br40
						onPress={handleSaveName}
						backgroundColor={COLORS.PRIMARY}
						label="Xác nhận"
					/>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};
export default Welcome;
