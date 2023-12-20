import React, { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { COLORS, ICON_COLORS } from "../../utils/color";
import { StyleSheet } from "react-native";
import { BOX_SHADOW } from "../../utils/styles";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const ServiceButton = ({
	name,
	icon,
	isActive,
	onPress,
}: {
	name: string;
	icon: React.ReactElement;
	isActive: boolean;
	onPress?: () => void;
}) => {
	return (
		<TouchableOpacity
			padding-16
			br40
			center
			backgroundColor={isActive ? COLORS.PRIMARY : COLORS.WHITE}
			style={[styles.serviceButton, BOX_SHADOW.NORMAL]}
			onPress={onPress}
		>
			<icon.type
				{...icon.props}
				color={isActive ? COLORS.WHITE : COLORS.TEXT_BLACK}
			/>
			<Text color={isActive ? COLORS.WHITE : COLORS.TEXT_BLACK}>{name}</Text>
		</TouchableOpacity>
	);
};

type activeState = "temperature" | "humidity";
const serviceList: {
	id: activeState;
	label: string;
	icon: React.ReactElement;
}[] = [
	{
		id: "temperature",
		label: "Nhiệt độ",
		icon: <MaterialCommunityIcon name="temperature-celsius" size={30} />,
	},
	{
		id: "humidity",
		label: "Độ ẩm",
		icon: <MaterialCommunityIcon name="water-outline" size={30} />,
	},
];

const StatusPane = () => {
	const [currentActive, setCurrentActive] =
		useState<activeState>("temperature");

	return (
		<View>
			<View row>
				{serviceList.map((service) => (
					<ServiceButton
						key={service.id}
						name={service.label}
						isActive={service.id === currentActive}
						icon={service.icon}
						onPress={() => {
							setCurrentActive(service.id);
						}}
					/>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	serviceButton: {},
});

export default StatusPane;
