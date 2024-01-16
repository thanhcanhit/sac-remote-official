import { useState } from "react";
import { Button, Text, TextField, View } from "react-native-ui-lib";
import { Animated, KeyboardAvoidingView } from "react-native";
import { COLORS } from "../../utils/color";
import { StepType } from ".";
import storage, { USER_INFO_KEY } from "../../storage/storage";
import ChatSVG from "../../assets/svgs/chat.svg";

const GetNamePage = ({ onPress, x, y }: StepType) => {
	const [name, setName] = useState<string>("");

	const handleSaveName = () => {
		if (name.length < 3) return;
		storage.save({ key: USER_INFO_KEY, data: name });
		try {
			onPress();
		} catch (e) {}
	};

	return (
		<View flex center>
			<KeyboardAvoidingView style={{ width: "100%", height: "100%" }}>
				<View flex-2 center>
					<Animated.View
						style={{
							transform: [{ translateX: x }, { translateY: y }],
						}}
					>
						<ChatSVG width={250} height={400} />
					</Animated.View>
					<Text text50 color={COLORS.PRIMARY} center marginB-16>
						Let me know your name
					</Text>
					<View left paddingH-8>
						<TextField
							value={name}
							onChange={(e) => setName(e.nativeEvent.text)}
							text60
							color={COLORS.TEXT_BLACK}
							showCharCounter
							validate={["required"]}
							validationMessage={["Please 👋"]}
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
						disabled={name.length < 3}
						onPress={handleSaveName}
						backgroundColor={COLORS.PRIMARY}
						label="Submit"
					/>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};
export default GetNamePage;
