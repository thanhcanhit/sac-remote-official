import React, { Fragment, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
	ActionSheet,
	Button,
	Card,
	Slider,
	Text,
	View,
} from "react-native-ui-lib";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../utils/color";
import { ServiceName } from ".";

type SettingState = {
	min: number;
	max: number;
};

const Setting = () => {
	const [currentSetting, setCurrentSetting] = useState<ServiceName>();
	const [slider, setSlider] = useState<SettingState>({ min: 0, max: 100 });
	const timer = useRef<NodeJS.Timeout>();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [tempSetting, setTempSetting] = useState<SettingState>({
		min: 0,
		max: 0,
	});
	const [humiditySetting, setHumiditySetting] = useState<SettingState>({
		min: 0,
		max: 0,
	});

	const toggleActionSheet = () => {
		setIsModalOpen(!isModalOpen);
	};

	const onTempButtonClick = () => {
		toggleActionSheet();
		setCurrentSetting("temperature");
		setSlider(tempSetting);
	};

	const onHumidityButtonClick = () => {
		toggleActionSheet();
		setCurrentSetting("humidity");
		setSlider(humiditySetting);
	};

	const settings: {
		name: string;
		content: React.ReactElement;
		onPress: (props: any) => void;
	}[] = [
		{
			name: "Auto by temperature",
			content: (
				<View flex row>
					<View gap-8 flex-4>
						<Text text80 color={COLORS.SECONDARY}>
							Thiết lập tự động bật/tắt thiết bị theo
						</Text>
						<Text text60 color={COLORS.PRIMARY}>
							Nhiệt độ
						</Text>
					</View>
					<View flex-1 center>
						<MaterialCommunityIcon
							name="temperature-celsius"
							size={30}
							color={COLORS.PRIMARY}
						/>
					</View>
				</View>
			),
			onPress: onTempButtonClick,
		},
		{
			name: "Auto by humidity",
			content: (
				<View flex row>
					<View gap-8 flex-4>
						<Text text80 color={COLORS.SECONDARY}>
							Thiết lập tự động bật/tắt thiết bị theo
						</Text>
						<Text text60 color={COLORS.PRIMARY}>
							Độ ẩm
						</Text>
					</View>
					<View flex-1 center>
						<MaterialCommunityIcon
							name="water-outline"
							size={30}
							color={COLORS.PRIMARY}
						/>
					</View>
				</View>
			),
			onPress: onHumidityButtonClick,
		},
	];

	const onDismiss = () => {
		toggleActionSheet();
	};

	const onSliderRangeChange = (values: { min: number; max: number }) => {
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			const min = Math.round(values.min);
			const max = Math.round(values.max);
			setSlider({ min, max });
		}, 200);
	};

	const onSubmit = () => {
		if (currentSetting == "temperature") {
			setTempSetting(slider);
		} else if (currentSetting == "humidity") {
			setHumiditySetting(slider);
		}
		toggleActionSheet();
	};

	const settingName =
		currentSetting == "temperature" ? "Nhiệt độ (°C)" : "Độ ẩm (%)";

	return (
		<Fragment>
			<ScrollView style={{ width: "100%" }}>
				<View gap-8>
					{settings.map((setting) => (
						<Card
							enableShadow
							row
							padding-16
							height={100}
							onPress={setting.onPress}
							key={setting.name}
						>
							{setting.content}
						</Card>
					))}
				</View>
			</ScrollView>

			{/* Action sheet for detail setting */}
			<ActionSheet
				visible={isModalOpen}
				title={"Hãy thiết lập giới hạn tắt/mở"}
				message={"Message goes here"}
				cancelButtonIndex={3}
				destructiveButtonIndex={0}
				renderAction={(options, index) => (
					<View paddingH-8 gap-8 key={index}>
						<View paddingH-16>
							<Slider
								useRange
								useGap={false}
								minimumValue={0}
								maximumValue={100}
								initialMinimumValue={slider.min}
								initialMaximumValue={slider.max}
								onRangeChange={onSliderRangeChange}
								thumbTintColor={COLORS.PRIMARY}
								minimumTrackTintColor={COLORS.PRIMARY}
							/>
						</View>
						<View>
							<Text text60 color={COLORS.PRIMARY}>
								{settingName}
							</Text>
							<Text>
								Thiết bị sẽ tắt khi dưới:{" "}
								<Text text60 color={COLORS.PRIMARY}>
									{slider.min}
								</Text>
							</Text>
							<Text>
								Thiết bị sẽ bật khi trên:{" "}
								<Text text60 color={COLORS.PRIMARY}>
									{slider.max}
								</Text>
							</Text>
						</View>
						<Button
							label="Xác nhận"
							backgroundColor={COLORS.PRIMARY}
							onPress={onSubmit}
						/>
						<Button
							label="Hủy bỏ"
							backgroundColor={COLORS.GRAY}
							onPress={onDismiss}
						/>
					</View>
				)}
				options={[{ label: "" }]}
			/>
		</Fragment>
	);
};

export default Setting;
