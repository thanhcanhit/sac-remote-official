import React, { useContext, useEffect, useState } from "react";
import { Incubator, Text, View } from "react-native-ui-lib";
import { BluetoothContext } from "../../contexts/BluetoothContextProvider";
import FanSwitch from "../../components/FanSwitch";
import StatusPane from "./StatusPane";
import Setting from "./Setting";
import { COLORS } from "../../utils/color";

export type InfoCharacterisctic =
	| "temperature"
	| "humidity"
	| "battery"
	| "fanSpeed";
const Remote = () => {
	const {
		battery,
		humidity,
		power,
		temperature,
		setNewPower,
		connectedDevice,
	} = useContext(BluetoothContext).useBLE;
	const [currentActive, setCurrentActive] =
		useState<InfoCharacterisctic>("temperature");
	const [showToast, setShowToast] = useState<boolean>(false);

	const togglePower = () => {
		setNewPower(!power);
	};

	useEffect(() => {
		const to = setTimeout(() => {
			if (!connectedDevice) {
				setShowToast(true);
			}
		}, 500);

		return () => {
			clearTimeout(to);
		};
	}, []);

	return (
		<View flex>
			<View flex-3>
				<View row centerV>
					<View flex-3 left>
						<Text text50>Status</Text>
						{!connectedDevice && (
							<Text text90 center color={COLORS.RED}>
								(There is currently no connection to any device)
							</Text>
						)}
					</View>
					<View flex-1 right>
						<FanSwitch state={power} onPress={togglePower} />
					</View>
				</View>
				<View>
					<StatusPane
						currentActive={currentActive}
						changeCurrentActive={setCurrentActive}
						temperature={temperature}
						humidity={humidity}
						battery={battery}
					/>
				</View>
			</View>
			<View flex-2 marginT-32>
				<View flex-3 left>
					<Text text50 marginB-8>
						Setting
					</Text>
					<Setting />
				</View>
			</View>

			<Incubator.Toast
				message={"There are currently no connections to any SAC devices"}
				visible={showToast}
				preset={"offline"}
				centerMessage
				swipeable
				position={"bottom"}
				backgroundColor={COLORS.WHITE}
				autoDismiss={2000}
				onDismiss={() => setShowToast(false)}
			/>
		</View>
	);
};

export default Remote;
