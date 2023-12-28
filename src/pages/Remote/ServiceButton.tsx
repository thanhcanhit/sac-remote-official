import React from "react";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { COLORS } from "../../utils/color";
import { BOX_SHADOW } from "../../utils/styles";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { InfoCharacterisctic } from ".";
import BatteryBar from "../../components/BatteryBar";

const ServiceButton = ({
	id,
	name,
	icon,
	isActive,
	value,
	onPress,
}: {
	id: InfoCharacterisctic;
	name: string;
	icon: React.ReactElement;
	isActive: boolean;
	value?: number;
	onPress?: () => void;
}) => {
	const opacity = isActive ? 1 : 0.5;

	const Icon =
		id == "battery" ? (
			<BatteryBar value={value || 0} />
		) : (
			<icon.type {...icon.props} color={COLORS.WHITE} />
		);

	return (
		<TouchableOpacity
			delayPressIn={0}
			br40
			center
			style={[{ opacity: opacity }, styles.serviceButton, BOX_SHADOW.SMALL]}
			onPress={onPress}
		>
			<LinearGradient
				colors={
					isActive
						? [COLORS.PRIMARY, COLORS.LIGHT_PRIMARY]
						: [COLORS.LIGHT_PRIMARY, COLORS.LIGHT_PRIMARY]
				}
				locations={[0.0244, 0.9869]}
				start={{ x: 0.03, y: 0 }}
				end={{ x: 0.97, y: 0 }}
				style={{
					padding: 16,
					width: "100%",
					height: "100%",
				}}
			>
				<View gap-8>
					{Icon}

					<Text color={COLORS.WHITE}>{name}</Text>
				</View>
			</LinearGradient>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	serviceButton: { width: 100, height: 100, overflow: "hidden" },
});

export default ServiceButton;
