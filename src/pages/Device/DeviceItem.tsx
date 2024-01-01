import React from "react";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { COLORS, ICON_COLORS } from "../../utils/color";
import { BOX_SHADOW } from "../../utils/styles";
import { Device as BluetoothDevice } from "react-native-ble-plx";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const DeviceItem = ({
	device,
	isConnected,
	onPress,
}: {
	device: BluetoothDevice;
	isConnected?: boolean;
	onPress?: () => void;
}) => {
	return (
		<TouchableOpacity
			activeBackgroundColor={COLORS.PRIMARY}
			br40
			style={[BOX_SHADOW.SMALL]}
			onPress={onPress}
		>
			<View
				row
				backgroundColor={isConnected ? COLORS.PRIMARY : COLORS.WHITE}
				padding-16
				br40
			>
				<View flex-1 center>
					{isConnected ? (
						<MaterialIcons
							name="bluetooth-connected"
							size={25}
							color={COLORS.WHITE}
						/>
					) : device.name ? (
						<MaterialCommunityIcons
							name="devices"
							size={25}
							color={ICON_COLORS.DEFAULT}
						/>
					) : (
						<MaterialIcons
							name="device-unknown"
							size={25}
							color={ICON_COLORS.DEFAULT}
						/>
					)}
				</View>
				<View flex-5>
					<Text text70L color={isConnected ? COLORS.WHITE : COLORS.TEXT_BLACK}>
						{device.name || "Unnamed device"}
					</Text>
					<Text color={isConnected ? COLORS.WHITE : COLORS.SECONDARY}>
						{device.id}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default DeviceItem;
