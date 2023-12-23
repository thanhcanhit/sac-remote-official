import React from "react";
import { Pressable } from "react-native";
import { Button, View } from "react-native-ui-lib";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../utils/color";
import useBLE from "../../bluetooth/useBLE";
const BluetoothConnectedIcon = () => (
	<MaterialIcon name="bluetooth-connected" size={20} color={COLORS.WHITE} />
);
const BluetoothDisconnectIcon = () => (
	<MaterialIcon name="bluetooth-disabled" size={20} color={COLORS.WHITE} />
);
const ConnectStatus = () => {
	const { connectedDevice } = useBLE();
	return (
		<View style={{ position: "absolute", top: -40, right: 0 }} absR-0 absT-0>
			{connectedDevice ? (
				<Button
					backgroundColor={COLORS.PRIMARY}
					marginR-16
					size="small"
					round
					color={COLORS.WHITE}
				>
					<BluetoothConnectedIcon />
				</Button>
			) : (
				<Button
					backgroundColor={COLORS.GRAY}
					round
					marginR-16
					size="small"
					color={COLORS.WHITE}
				>
					<BluetoothDisconnectIcon />
				</Button>
			)}
		</View>
	);
};

export default ConnectStatus;
