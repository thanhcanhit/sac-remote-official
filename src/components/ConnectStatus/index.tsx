import React, { useContext } from "react";
import { Button, View } from "react-native-ui-lib";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../utils/color";
import { BluetoothContext } from "../../contexts/BluetoothContextProvider";
const BluetoothConnectedIcon = () => (
	<MaterialIcon name="bluetooth-connected" size={20} color={COLORS.WHITE} />
);
const BluetoothDisconnectIcon = () => (
	<MaterialIcon name="bluetooth-disabled" size={20} color={COLORS.WHITE} />
);
const ConnectStatus = () => {
	const connectedDevice = useContext(BluetoothContext).useBLE?.connectedDevice;

	return (
		<View>
			{connectedDevice?.id ? (
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
