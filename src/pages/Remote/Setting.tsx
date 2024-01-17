import React, { Fragment, useContext, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
	ActionSheet,
	Button,
	Card,
	Incubator,
	Slider,
	Text,
	View,
} from "react-native-ui-lib";
import { BluetoothContext } from "../../contexts/BluetoothContextProvider";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../utils/color";
import { InfoCharacterisctic } from ".";
import { SettingState } from "../../bluetooth/useBLE";

const Setting = () => {
	const {
		setNewSettingHumi,
		setNewSettingTemp,
		settingHumi,
		settingTemp,
		control,
		auto,
		setNewControl,
	} = useContext(BluetoothContext).useBLE;

	const [currentSetting, setCurrentSetting] = useState<InfoCharacterisctic>();
	const [rangeSlider, setRangeSlider] = useState<SettingState>({
		min: 0,
		max: 100,
	});
	const [speedSlider, setSpeedSlider] = useState<number>(() => {
		if (control) return (control - 100) / 50;
		return 1;
	});

	const [showAutoIsOn, setShowAutoIsOn] = useState<boolean>(false);
	const [isOpen, setOpen] = useState<boolean>(false);
	const timer = useRef<NodeJS.Timeout>();

	const tempSetting: SettingState = settingTemp;
	const humiditySetting: SettingState = settingHumi;

	const toggleActionSheet = () => {
		setOpen(!isOpen);
	};

	const onTempButtonClick = () => {
		toggleActionSheet();
		setCurrentSetting("temperature");
		setRangeSlider(tempSetting);
	};

	const onHumidityButtonClick = () => {
		toggleActionSheet();
		setCurrentSetting("humidity");
		setRangeSlider(humiditySetting);
	};

	const onFanSpeedButtonClick = () => {
		if (auto) {
			setShowAutoIsOn(true);
		}
		toggleActionSheet();
		setCurrentSetting("fanSpeed");
		setSpeedSlider((control - 100) / 50);
	};

	const settings: {
		name: string;
		content: React.ReactElement;
		onPress: (props: any) => void;
	}[] = [
		{
			name: "Set fan speed",
			content: (
				<View flex row>
					<View gap-8 flex-4>
						<Text text80 color={COLORS.SECONDARY}>
							Change level
						</Text>
						<Text text60 color={COLORS.PRIMARY}>
							Fan speed
						</Text>
					</View>
					<View flex-1 center>
						<MaterialCommunityIcon
							name="fan"
							size={30}
							color={COLORS.PRIMARY}
						/>
					</View>
				</View>
			),
			onPress: onFanSpeedButtonClick,
		},
		{
			name: "Auto by temperature",
			content: (
				<View flex row>
					<View gap-8 flex-4>
						<Text text80 color={COLORS.SECONDARY}>
							Automatically turn on/off according to
						</Text>
						<Text text60 color={COLORS.PRIMARY}>
							Temperature
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
							Automatically turn on/off according to
						</Text>
						<Text text60 color={COLORS.PRIMARY}>
							Humidity
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
		if (currentSetting == "fanSpeed") {
			setSpeedSlider(control);
		}
		toggleActionSheet();
	};

	const onSubmit = () => {
		if (currentSetting == "temperature") {
			setNewSettingTemp({ min: rangeSlider.min, max: rangeSlider.max });
		} else if (currentSetting == "humidity") {
			setNewSettingHumi({ min: rangeSlider.min, max: rangeSlider.max });
		} else if (currentSetting == "fanSpeed") {
			const speedValue = speedSlider == 1 ? 150 : speedSlider == 2 ? 200 : 250;
			setNewControl(speedValue);
		}
		toggleActionSheet();
	};

	const onSliderRangeChange = (values: { min: number; max: number }) => {
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			const min = Math.round(values.min);
			const max = Math.round(values.max);
			setRangeSlider({ min, max });
		}, 200);
	};

	const settingName = useMemo(() => {
		switch (currentSetting) {
			case "humidity":
				return "Humidity (%)";
			case "temperature":
				return "Temperature (°C)";
			case "fanSpeed":
				return "Fan speed";
		}
	}, [currentSetting]);

	const actionSheetContent: React.ReactElement = useMemo(() => {
		switch (currentSetting) {
			case "humidity":
			case "temperature":
				return (
					<>
						<View paddingH-16>
							<Slider
								useRange
								useGap={false}
								minimumValue={currentSetting == "temperature" ? 25 : 0}
								maximumValue={currentSetting == "temperature" ? 40 : 100}
								initialMinimumValue={rangeSlider.min}
								initialMaximumValue={rangeSlider.max}
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
								The device will turn off when under:{" "}
								<Text text60 color={COLORS.PRIMARY}>
									{rangeSlider.min}
								</Text>
							</Text>
							<Text>
								The device will turn on when on:{" "}
								<Text text60 color={COLORS.PRIMARY}>
									{rangeSlider.max}
								</Text>
							</Text>
						</View>
					</>
				);
			case "fanSpeed":
				return (
					<>
						<View paddingH-16>
							<Slider
								value={speedSlider}
								minimumValue={1}
								maximumValue={3}
								step={1}
								onValueChange={(value) => {
									setSpeedSlider(value);
								}}
								thumbTintColor={COLORS.PRIMARY}
								minimumTrackTintColor={COLORS.PRIMARY}
							/>
						</View>
						<View>
							<Text text60 color={COLORS.PRIMARY}>
								{settingName}
							</Text>
							<Text>
								Current level:{" "}
								<Text text60 color={COLORS.PRIMARY}>
									{speedSlider}
								</Text>
							</Text>
						</View>
					</>
				);
			default:
				return <></>;
		}
	}, [currentSetting, speedSlider, rangeSlider]);

	return (
		<Fragment>
			<ScrollView >
				<View gap-8>
					{settings.map((setting) => (
						<Card
							enableShadow
							row
							padding-16
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
				visible={isOpen}
				title={"Make your choice"}
				message={"Message goes here"}
				cancelButtonIndex={3}
				destructiveButtonIndex={0}
				renderAction={(options, index) => (
					<View paddingH-8 gap-8 key={index}>
						{actionSheetContent}

						<Button
							label="Confirm"
							backgroundColor={COLORS.PRIMARY}
							onPress={onSubmit}
						/>
						<Button
							label="Cancel"
							backgroundColor={COLORS.GRAY}
							onPress={onDismiss}
						/>
					</View>
				)}
				options={[{ label: "Setting" }]}
			/>
			<Incubator.Toast
				message={
					"The device is in Automatic mode! turn off automatic to control."
				}
				visible={showAutoIsOn}
				preset={"general"}
				iconColor={COLORS.PRIMARY}
				centerMessage
				swipeable
				position={"bottom"}
				backgroundColor={COLORS.WHITE}
				autoDismiss={2000}
				onDismiss={() => setShowAutoIsOn(false)}
			/>
		</Fragment>
	);
};

export default Setting;
