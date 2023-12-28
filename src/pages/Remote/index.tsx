import React, { useContext, useState } from "react";
import { Text, View } from "react-native-ui-lib";
import FanSwitch from "../../components/FanSwitch";
import StatusPane from "./StatusPane";
import Setting from "./Setting";
import { BluetoothContext } from "../../contexts/BluetoothContextProvider";

export type InfoCharacterisctic = "temperature" | "humidity" | "battery";
const Remote = () => {
	const { battery, humidity, power, temperature, setControl } =
		useContext(BluetoothContext).useBLE;
	const [currentActive, setCurrentActive] =
		useState<InfoCharacterisctic>("temperature");

	const togglePower = () => {
		setControl(!power);
	};

	return (
		<View flex>
			<View flex-3>
				<View row centerV>
					<View flex-3 left>
						<Text text50>Trạng thái</Text>
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
						Thiết lập
					</Text>
					<Setting />
				</View>
			</View>
		</View>
	);
};

export default Remote;
